"""
Service to fetch system prompt from Google Docs
"""
import os
import socket
import time
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from django.conf import settings


class GoogleDocsService:
    """Service to interact with Google Docs API"""
    
    SCOPES = ['https://www.googleapis.com/auth/documents.readonly']
    
    def __init__(self):
        self.creds = None
        self.service = None
        self._cached_prompt = None
        self._cache_timestamp = None
        self._cache_ttl = int(os.getenv('GOOGLE_DOCS_CACHE_TTL', '3600'))  # Default: 1 hour
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google Docs API"""
        creds_file = getattr(settings, 'GOOGLE_CREDENTIALS_FILE', 'credentials.json')
        token_file = 'token.json'
        
        # Load existing token if available
        if os.path.exists(token_file):
            self.creds = Credentials.from_authorized_user_file(token_file, self.SCOPES)
        
        # If no valid credentials, do OAuth flow
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                if not os.path.exists(creds_file):
                    raise FileNotFoundError(
                        f"Credentials file not found: {creds_file}. "
                        "Please download it from Google Cloud Console."
                    )
                flow = InstalledAppFlow.from_client_secrets_file(creds_file, self.SCOPES)
                # Run OAuth flow - browser will open for authentication
                print("\n" + "="*60)
                print("🔐 Opening browser for Google authentication...")
                print("="*60)
                print("1. Browser will open automatically")
                print("2. Sign in with your Google account")
                print("3. Click 'Allow' to grant permissions")
                print("4. You will be redirected to localhost - WAIT for success page")
                print("5. DO NOT close the browser tab until you see success message")
                print("="*60 + "\n")
                
                # Try browser flow first, fallback to console if it fails
                use_console = os.getenv('GOOGLE_OAUTH_USE_CONSOLE', 'False').lower() == 'true'
                
                if use_console:
                    print("Using console-based authentication (manual entry)...\n")
                    try:
                        # Use out-of-band redirect URI for console flow
                        flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
                        
                        # Get authorization URL
                        auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
                        
                        print("="*60)
                        print("Step 1: Visit this URL in your browser:")
                        print("="*60)
                        print(auth_url)
                        print("="*60)
                        print("\nStep 2: After authorizing, Google will show an authorization CODE")
                        print("Step 3: Copy that code (it's a long string)")
                        print("Step 4: Paste the authorization code here:")
                        
                        auth_code = input("Authorization code: ").strip()
                        
                        # Fetch token using the authorization code
                        flow.fetch_token(code=auth_code)
                        self.creds = flow.credentials
                        
                        print("\n✅ Google authentication successful! Token saved.\n")
                    except Exception as e:
                        print(f"\n❌ Console authentication failed: {str(e)}\n")
                        raise
                else:
                    try:
                        # Use fixed port for better reliability
                        # Find an available port starting from 8080
                        port = 8080
                        for _ in range(10):  # Try up to 10 ports
                            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                            result = sock.connect_ex(('127.0.0.1', port))
                            if result != 0:  # Port is available
                                sock.close()
                                break
                            sock.close()
                            port += 1
                        else:
                            port = 0  # Fallback to random port
                        
                        print(f"📡 Using port {port} for OAuth callback...")
                        print("⚠️  If browser flow fails, set GOOGLE_OAUTH_USE_CONSOLE=true in .env\n")
                        
                        self.creds = flow.run_local_server(
                            port=port,
                            prompt='consent',
                            open_browser=True,
                            success_message="✅ Authentication successful! You can close this tab now."
                        )
                        print("\n" + "="*60)
                        print("✅ Google authentication successful! Token saved.")
                        print("="*60 + "\n")
                    except (KeyboardInterrupt, Exception) as e:
                        if isinstance(e, KeyboardInterrupt):
                            raise
                        print("\n" + "="*60)
                        print(f"❌ Browser authentication failed: {str(e)}")
                        print("="*60)
                        print("\n💡 Trying console-based flow as fallback...\n")
                        
                        # Fallback to console flow
                        try:
                            print("="*60)
                            print("Manual Console Authentication")
                            print("="*60)
                            # Use out-of-band redirect URI for console flow
                            flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
                            
                            # Get authorization URL
                            auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
                            
                            print("\nStep 1: Visit this URL in your browser:")
                            print("-"*60)
                            print(auth_url)
                            print("-"*60)
                            print("\nStep 2: After authorizing, Google will show an authorization CODE on the page")
                            print("Step 3: Copy that code (long string) and paste it here:")
                            
                            auth_code = input("Authorization code: ").strip()
                            
                            # Fetch token using the authorization code
                            flow.fetch_token(code=auth_code)
                            self.creds = flow.credentials
                            
                            print("\n✅ Google authentication successful (console flow)! Token saved.\n")
                        except Exception as e2:
                            print(f"\n❌ Console authentication also failed: {str(e2)}")
                            print("\nTroubleshooting steps:")
                            print("1. Make sure you added your email as a test user in Google Cloud Console")
                            print("   → APIs & Services → OAuth consent screen → Test users")
                            print("2. Make sure you clicked 'Allow' in the Google consent screen")
                            print("3. Check that credentials.json file exists and is valid")
                            print("4. Try manually: Set GOOGLE_OAUTH_USE_CONSOLE=true in .env")
                            print("="*60 + "\n")
                            raise e2
            
            # Save credentials for next run
            with open(token_file, 'w') as token:
                token.write(self.creds.to_json())
        
        # Build the service
        self.service = build('docs', 'v1', credentials=self.creds)
    
    def get_system_prompt(self, document_id=None, force_refresh=False):
        """
        Fetch system prompt from Google Doc (with caching)
        
        Args:
            document_id: Google Doc ID (if None, uses GOOGLE_DOCS_SYSTEM_PROMPT_ID from settings)
            force_refresh: If True, bypass cache and fetch fresh content
        
        Returns:
            str: The system prompt text
        """
        # Check cache first (unless force_refresh is True)
        if not force_refresh and self._cached_prompt is not None:
            if self._cache_timestamp is not None:
                age = time.time() - self._cache_timestamp
                if age < self._cache_ttl:
                    # Cache is still valid
                    return self._cached_prompt
        
        # Cache expired or doesn't exist - fetch from Google Docs
        if document_id is None:
            document_id = getattr(settings, 'GOOGLE_DOCS_SYSTEM_PROMPT_ID')
        
        if not document_id:
            raise ValueError("Google Docs document ID not configured")
        
        try:
            doc = self.service.documents().get(documentId=document_id).execute()
            
            # Extract text from all content elements
            text_content = []
            for element in doc.get('body', {}).get('content', []):
                if 'paragraph' in element:
                    for para_element in element['paragraph'].get('elements', []):
                        if 'textRun' in para_element:
                            text_content.append(para_element['textRun'].get('content', ''))
            
            prompt_text = ''.join(text_content).strip()
            
            # Update cache
            self._cached_prompt = prompt_text
            self._cache_timestamp = time.time()
            
            return prompt_text
        
        except Exception as e:
            raise Exception(f"Error fetching document from Google Docs: {str(e)}")


# Singleton instance
_google_docs_service = None

def get_google_docs_service():
    """Get singleton instance of GoogleDocsService"""
    global _google_docs_service
    if _google_docs_service is None:
        _google_docs_service = GoogleDocsService()
    return _google_docs_service

