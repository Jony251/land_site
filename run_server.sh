#!/bin/bash
# Quick script to run the Django server on port 8234

# Activate conda environment if it exists
if command -v conda &> /dev/null; then
    source $(conda info --base)/etc/profile.d/conda.sh
    conda activate eugeny_be 2>/dev/null || echo "Conda environment 'eugeny_be' not found. Using system Python."
fi

# Fallback to venv if conda not available
if [ -d "venv" ] && [ -z "$CONDA_DEFAULT_ENV" ]; then
    source venv/bin/activate
fi

# Run migrations first (optional, uncomment if needed)
# python manage.py migrate

# Run server on port 8234
echo "Starting Django server on port 8234..."
python manage.py runserver 0.0.0.0:8234

