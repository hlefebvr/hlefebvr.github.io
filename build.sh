python3 pre-build.py

FILES=$(find . -type f -name '*.rendered.Rmd' | grep -v "_site")

for FILE in $FILES
do
    echo $FILE
    R --no-save --no-restore -e "rmarkdown::render(\"$FILE\")" || exit
done

jekyll build
