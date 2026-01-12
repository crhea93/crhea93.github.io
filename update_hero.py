#!/usr/bin/env python3
import re

new_hero = """	<!-- Header Section -->
	<section class="intro-section">
		<div class="container">
			<div class="intro" style="text-align: center;">
				<div class="row justify-content-center">
					<div class="col-sm-8 col-md-6 col-lg-4">
						<div class="profile-img margin-b-30" style="margin: 0 auto;">
							<img src="images/Paris.jpg" alt="Carter Rhea">
						</div>
					</div>
				</div>

				<div class="row justify-content-center">
					<div class="col-12">
						<h2 style="color: #fff; margin-bottom: 20px; margin-top: 30px;"><b>Carter Rhea</b></h2>
						<h4 class="font-yellow" style="margin-bottom: 10px;">
							Ph.D. Observational Astrophysics
						</h4>
						<h5 style="color: rgba(255,255,255,0.9); font-weight: 400; margin-bottom: 40px;">
							Algorithm & Software Developer at Dragonfly FRO
						</h5>
					</div>
				</div>
			</div>
		</div>
	</section>"""

files = ["Publications.html", "Projects.html", "Talks.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find and replace the intro-section
    pattern = r"<!-- Header Section -->.*?</section>.*?<!-- "
    replacement = new_hero + "\n\n\t<!-- "

    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    with open(filename, "w") as f:
        f.write(content)

    print(f"Updated {filename}")

print("All hero sections updated!")
