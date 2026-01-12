# Dynamic Publications System

## Overview

Your publications page now automatically fetches data from the NASA ADS API without CORS issues. The system uses a pre-generated JSON file that's updated automatically.

## How It Works

1. **Python Script** (`scripts/fetch_publications.py`): Fetches publications from NASA ADS API
2. **GitHub Actions** (`.github/workflows/update-publications.yml`): Runs the script daily
3. **Publications Page** (`Publications.html`): Loads data from `data/publications.json`

## Setup Instructions

### 1. Add ADS API Key to GitHub Secrets

1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/crhea93.github.io
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `ADS_API_KEY`
5. Value: `TUhSWd2xbsM6sSP9zVdvZBVNgYmS0m188x1mlKup`
6. Click "Add secret"

### 2. Enable GitHub Actions

1. Go to the "Actions" tab in your repository
2. Enable workflows if prompted
3. The workflow will run automatically every day at midnight UTC

### 3. Manual Update

To manually update publications:

```bash
# Option 1: Run locally
cd /path/to/crhea93.github.io
python3 scripts/fetch_publications.py

# Option 2: Trigger GitHub Action
# Go to Actions → Update Publications → Run workflow
```

## File Structure

```
crhea93.github.io/
├── .github/
│   └── workflows/
│       └── update-publications.yml    # GitHub Action workflow
├── scripts/
│   └── fetch_publications.py          # Python script to fetch from ADS
├── data/
│   └── publications.json              # Generated publications data
├── common-js/
│   └── publications.js                # Frontend JavaScript
└── Publications.html                  # Publications page
```

## Features

✅ **No CORS Issues**: Loads from static JSON file, not direct API calls
✅ **Automatic Updates**: GitHub Actions runs daily to fetch new publications
✅ **Fast Loading**: Pre-generated data loads instantly
✅ **No API Limits**: Visitors don't hit ADS API rate limits
✅ **Offline Friendly**: Works even if ADS API is down

## Customization

### Change Update Frequency

Edit `.github/workflows/update-publications.yml`:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
    # Examples:
    # - cron: '0 */6 * * *'  # Every 6 hours
    # - cron: '0 0 * * 0'    # Weekly on Sundays
```

### Modify Search Query

Edit `scripts/fetch_publications.py`:

```python
AUTHOR_NAME = 'Rhea, Carter'  # Change to your ADS author name
```

## Troubleshooting

### Publications not updating?

1. Check GitHub Actions tab for errors
2. Verify ADS_API_KEY is set in repository secrets
3. Manually run: `python3 scripts/fetch_publications.py`

### Missing publications?

- Check author name spelling in `fetch_publications.py`
- ADS may have different author name formats (e.g., "Rhea, C." vs "Rhea, Carter")

### Local testing

```bash
# Install requirements
pip install requests

# Set API key
export ADS_API_KEY="your_key_here"

# Run script
python3 scripts/fetch_publications.py

# Check output
cat data/publications.json
```

## Current Status

✅ Initial data generated: **51 publications**
✅ JavaScript updated to load from JSON
✅ GitHub Actions workflow configured
⏳ Pending: Add ADS_API_KEY to GitHub Secrets (manual step)

## Notes

- The Python script runs server-side, avoiding CORS issues
- Data updates automatically via GitHub Actions
- The website remains a static site (no backend server needed)
- Publications page works offline using cached JSON data
