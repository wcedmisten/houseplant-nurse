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
	Light          string
	Temperature    string
	Humidity       string
	Watering       string
	Soil           string
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

		a = append(a, Plant{
			id,
			line[1],
			line[2],
			line[3],
			line[4],
			line[5],
			line[6],
			line[7],
		})
	}

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"plants": a,
	})
}
