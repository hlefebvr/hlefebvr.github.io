import os
import re

def get_relative_prefix(filepath, base_directory):
    relative_path = os.path.relpath(filepath, base_directory)
    depth = len(os.path.dirname(relative_path).split(os.sep)) + 1
    return '../' * depth

def process_rmd_file(filepath, base_directory):
    
    with open(filepath, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    title_line = lines[0]
    title_match = re.match(r"# (.+)", title_line)
    if not title_match:
        raise RuntimeError(f"Title not found in {filepath}")
    
    title = title_match.group(1)
    
    prefix = get_relative_prefix(filepath, base_directory)
    
    yaml_front_matter = f"""---
title: {title}
output: 
  html_document:
    theme: null
    css: /assets/css/design.css
    self_contained: false
    highlight: null
    include:
      in_header: {prefix}_includes/head.html
      before_body: 
        - {prefix}_includes/header.html
        - {prefix}_includes/begin_content.html
        - {prefix}_includes/toc.html
        - {prefix}_includes/begin_post_content.html
      after_body: 
        - {prefix}_includes/handle_page_title.html
        - {prefix}_includes/end_post_content.html
        - {prefix}_includes/end_content.html
        - {prefix}_includes/footer.html
---
"""
    
    lines = lines[1:]

    lines += [f"""\n\n<br /><div class="warning">This document is automatically generated after every `git push` action on the public repository `hlefebvr/hlefebvr.github.io` using rmarkdown and Github Actions. This ensures the reproducibility of our data manipulation. The last compilation was performed on the `r format(Sys.time(), '%d/%m/%y %H:%M:%S')`.</div>"""]
    
    destination = re.sub(r'\.Rmd$', 'ed.Rmd', filepath)

    with open(destination, 'w', encoding='utf-8') as file:
        file.write(yaml_front_matter)
        file.writelines(lines)
    
    print(f"Processed {destination}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".render.Rmd"):
                process_rmd_file(os.path.join(root, file), directory)

directory_path = "open-science"
process_directory(directory_path)