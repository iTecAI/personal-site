docker build -t dax-personal .
docker run --name dax-personal-nginx-container -p 8080:8080 --rm dax-personal
echo "Killed container"