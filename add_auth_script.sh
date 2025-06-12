#!/bin/bash

# Script to add auth.js to menu.html
MENU_HTML="/Users/biswarupdutta/Library/CloudStorage/OneDrive-MSFT/WAF_mini_project_trae/menu.html"

# Use perl to insert auth.js script tag after navigation.js
perl -i -pe 's|(<script src="js/navigation.js"></script>)|\1\n    <script src="js/auth.js"></script>|' "$MENU_HTML"

echo "Added auth.js script to menu.html"

