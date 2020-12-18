package main

import (
	"encoding/csv"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// Setup route group for the API
	api := router.Group("/api")

	api.GET("/plants", PlantHandler)

	// Start and run the server
	router.Run(":5000")
}

// Plant represents a houseplant with care data
type Plant struct {
	Id             int
	ScientificName string
	CommonName     string
	Light          int
	Temperature    int
	Humidity       int
	Watering       int
	Soil           int
}

func PlantHandler(c *gin.Context) {
	var a []Plant

	// Open CSV file
	f, err := os.Open("plant_care_data.csv")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	// Read File into a Variable
	reader := csv.NewReader(f)

	reader.Read() // skip the CSV header

	lines, err := reader.ReadAll()

	for _, line := range lines {
		id, _ := strconv.Atoi(line[0])
		light, _ := strconv.Atoi(line[3])
		temperature, _ := strconv.Atoi(line[4])
		humidity, _ := strconv.Atoi(line[5])
		watering, _ := strconv.Atoi(line[6])
		soil, _ := strconv.Atoi(line[7])

		a = append(a, Plant{
			id,
			line[1],
			line[2],
			light,
			temperature,
			humidity,
			watering,
			soil,
		})
	}

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"plants": a,
	})
}
