# Conda Environment Setup

This project uses Conda for virtual environment management.

## Quick Start

The conda environment `eugeny_be` has already been created and all dependencies installed.

### Activate Environment

```bash
conda activate eugeny_be
```

### Deactivate Environment

```bash
conda deactivate
```

## Running the Server

Once the environment is activated, you can run the server:

```bash
# Activate environment
conda activate eugeny_be

# Run migrations (first time only)
python manage.py makemigrations
python manage.py migrate

# Start server on port 8234
python manage.py runserver 0.0.0.0:8234
```

Or use the provided script (it will activate conda automatically):

```bash
./run_server.sh
```

## Verifying Installation

Check that everything is installed:

```bash
conda activate eugeny_be
python --version  # Should show Python 3.10.x
pip list | grep Django  # Should show Django==4.2.7
```

## Managing the Environment

### List Environments

```bash
conda env list
```

### Update Packages

```bash
conda activate eugeny_be
pip install --upgrade -r requirements.txt
```

### Remove Environment (if needed)

```bash
conda deactivate
conda env remove -n eugeny_be
```

### Recreate Environment

```bash
conda create -n eugeny_be python=3.10 -y
conda activate eugeny_be
pip install -r requirements.txt
```

## Environment Details

- **Environment Name**: `eugeny_be`
- **Python Version**: 3.10.19
- **Location**: `/home/daria/anaconda3/envs/eugeny_be`

## Auto-activation (Optional)

If you want to auto-activate the environment when entering the project directory, you can add this to your `.bashrc` or `.zshrc`:

```bash
# Auto-activate conda environment for eugeny_be project
if [ -d "/home/daria/projects/eugeny_be" ]; then
    cd() {
        builtin cd "$@"
        if [[ "$PWD" == "/home/daria/projects/eugeny_be"* ]]; then
            conda activate eugeny_be 2>/dev/null
        fi
    }
fi
```

Or use `direnv` for more robust directory-based environment activation.

## VS Code / IDE Integration

If using VS Code, you can configure it to use the conda environment:

1. Open Command Palette (Ctrl+Shift+P)
2. Type "Python: Select Interpreter"
3. Choose: `/home/daria/anaconda3/envs/eugeny_be/bin/python`

Or add to `.vscode/settings.json`:

```json
{
    "python.defaultInterpreterPath": "/home/daria/anaconda3/envs/eugeny_be/bin/python"
}
```

