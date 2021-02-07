package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"fmt"

	"github.com/stretchr/testify/assert"
)

func TestExifData(t *testing.T) {
	ISOVal, FNumberFloat, ExposureTimeFloat := getEXIFData("/home/wedmisten/Downloads/IMG_20201225_204432.jpg")
	// ISOVal, FNumberFloat, ExposureTimeFloat := getEXIFData("/home/wce/Downloads/IMG_20200510_151630.jpg")

	assert.Equal(t, 1250, ISOVal)
	assert.Equal(t, 1.7, FNumberFloat)
	assert.Equal(t, .02, ExposureTimeFloat)
}

func TestFootCandles(t *testing.T) {
	fmt.Println(getFootCandlesFromImage("/home/wedmisten/Downloads/IMG_20200429_130423.jpg"))
}

func TestPlantsRoute(t *testing.T) {
	router := setUpRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/plants", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	// Convert the JSON response to a map
	var response map[string][]Plant
	err := json.Unmarshal([]byte(w.Body.String()), &response)

	plantList, exists := response["plants"]
	assert.Nil(t, err)
	assert.True(t, exists)

	// make sure all 229 plants are found
	assert.Equal(t, 229, len(plantList))

	// test the first plant data
	firstPlant := plantList[0]
	assert.Equal(t, 0, firstPlant.Id)
	assert.Equal(t, "Flowering Maple", firstPlant.CommonName)
	assert.Equal(t, "Abutilon hybridum", firstPlant.ScientificName)
	assert.Equal(t, "1", firstPlant.Light)
	assert.Equal(t, "1", firstPlant.Temperature)
	assert.Equal(t, "2", firstPlant.Humidity)
	assert.Equal(t, "2", firstPlant.Watering)
	assert.Equal(t, "1", firstPlant.Soil)
}

func TestSearchRoute(t *testing.T) {
	router := setUpRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/search?name=Flowering Maple", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	// Convert the JSON response to a map
	var response map[string][]Plant
	err := json.Unmarshal([]byte(w.Body.String()), &response)

	plantList, exists := response["plants"]
	assert.Nil(t, err)
	assert.True(t, exists)

	// make sure Flowering Maple is found
	assert.Equal(t, 1, len(plantList))

	// test the first plant data
	firstPlant := plantList[0]
	assert.Equal(t, 0, firstPlant.Id)
	assert.Equal(t, "Flowering Maple", firstPlant.CommonName)
	assert.Equal(t, "Abutilon hybridum", firstPlant.ScientificName)
	assert.Equal(t, "1", firstPlant.Light)
	assert.Equal(t, "1", firstPlant.Temperature)
	assert.Equal(t, "2", firstPlant.Humidity)
	assert.Equal(t, "2", firstPlant.Watering)
	assert.Equal(t, "1", firstPlant.Soil)
}

func TestSearchRouteGibberish(t *testing.T) {
	router := setUpRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/search?name=sadklfjaslkdjf", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	// Convert the JSON response to a map
	var response map[string][]Plant
	err := json.Unmarshal([]byte(w.Body.String()), &response)

	plantList, exists := response["plants"]
	assert.Nil(t, err)
	assert.True(t, exists)

	// make sure no plants are found
	assert.Equal(t, 0, len(plantList))
}
