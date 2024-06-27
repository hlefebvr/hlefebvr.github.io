python3 pre-build.py

for FILE in $(find . -type f -name '*.rendered.Rmd' | grep -v "_site")
do
    echo $FILE
    R -e "rmarkdown::render(\"$FILE\")" || exit
done

jekyll build