import re

# Navigation template for each page
nav_templates = {
    "Projects.html": """        <nav class="main-nav">
            <div class="container">
                <a href="index.html" class="logo">Carter Rhea</a>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="dark-mode-toggle" aria-label="Toggle dark mode"></button>
                    <button class="mobile-menu-toggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="Projects.html" class="active">Projects</a></li>
                        <li><a href="Publications.html">Publications</a></li>
                    </ul>
                </div>
            </div>
        </nav>""",
    "Publications.html": """        <nav class="main-nav">
            <div class="container">
                <a href="index.html" class="logo">Carter Rhea</a>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="dark-mode-toggle" aria-label="Toggle dark mode"></button>
                    <button class="mobile-menu-toggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="Projects.html">Projects</a></li>
                        <li><a href="Publications.html" class="active">Publications</a></li>
                    </ul>
                </div>
            </div>
        </nav>""",
    "Talks.html": """        <nav class="main-nav">
            <div class="container">
                <a href="index.html" class="logo">Carter Rhea</a>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="dark-mode-toggle" aria-label="Toggle dark mode"></button>
                    <button class="mobile-menu-toggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="Projects.html">Projects</a></li>
                        <li><a href="Publications.html">Publications</a></li>
                    </ul>
                </div>
            </div>
        </nav>""",
}

base_path = "/home/carterrhea/Documents/crhea93.github.io/"

for filename, new_nav in nav_templates.items():
    filepath = base_path + filename
    try:
        with open(filepath, "r") as f:
            content = f.read()

        # Replace navigation section
        pattern = r'<nav class="main-nav">.*?</nav>'
        content = re.sub(pattern, new_nav, content, flags=re.DOTALL)

        with open(filepath, "w") as f:
            f.write(content)

        print(f"Updated {filename}")
    except Exception as e:
        print(f"Error updating {filename}: {e}")
