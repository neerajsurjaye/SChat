
echo "Starting docker build"

@REM %~dp0 represents the current path in windows bat file
docker build -t neerajsurjaye/nginx:latest %~dp0

echo "Docker build complete"