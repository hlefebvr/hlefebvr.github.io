
for FILE in ./open-science/AA/*.render.Rmd
do
    echo $FILE
    R -e "rmarkdown::render(\"$FILE\")"
done

jekyll build