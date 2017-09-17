# weather-cloud


## Objective

Build a historical weather app using microservices and deploy to Google Cloud Platform


## Process

### Setup

_Note: Usually each of subfolders in the repository would be separate repositories_

* For local development, [Docker Compose](https://docs.docker.com/compose/) was used to simulate a cloud based environment.

* For initial iteration, went with [DarkSky API](https://darksky.net/dev)

* For the UI, went with [Angular](http://angular.io)

* For the conversion of `docker-compose` file to kubernetes files, went with [Kompose](http://kompose.io/)\

```
$ mkdir -p k8s/services
$ cd k8s/services
$ kompose convert -f ../../docker-compose.yml
```

* Followed this tutorial to create cluster: [Setting up Kubernetes in Google Container Engine](https://cloud.google.com/community/tutorials/developing-services-with-k8s#setting-up-kubernetes-in-google-container-engine)

    * _Note: had to enable billing and Google Container Engine API first_
    * _Note: regions and zones lookup info: [Compute Engine | Region and Zones](https://cloud.google.com/compute/docs/regions-zones/regions-zones)_

```
$ gcloud container \
    clusters create "weather-cloud" \
    --project "weather-cloud-h7rta20170916" \
    --zone "us-west1-a" \
    --machine-type "n1-standard-1" \
    --image-type "GCI" \
    --disk-size "100" \
    --scopes "https://www.googleapis.com/auth/compute","https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
    --num-nodes "2" \
    --network "default" \
    --enable-cloud-logging \
    --enable-cloud-monitoring
```

```
$ gcloud container clusters list --project "weather-cloud-h7rta20170916"
$ gcloud container clusters get-credentials "weather-cloud" --project "weather-cloud-h7rta20170916"
$ gcloud auth application-default login --project "weather-cloud-h7rta20170916"
```

* Followed this tutorial to upload images: [Container Registry | Pushing images to the registry](https://cloud.google.com/container-registry/docs/pushing-and-pulling#pushing_images_to_the_registry)

```
$ docker images
$ docker tag weathercloud_ui:latest us.gcr.io/weather-cloud-h7rta20170916/weathercloud_ui:v1
$ docker tag weathercloud_api:latest us.gcr.io/weather-cloud-h7rta20170916/weathercloud_api:v1
$ gcloud docker -- push us.gcr.io/weather-cloud-h7rta20170916/weathercloud_ui:v1
$ gcloud docker -- push us.gcr.io/weather-cloud-h7rta20170916/weathercloud_api:v1
$ gcloud container images list-tags us.gcr.io/weather-cloud-h7rta20170916
```
