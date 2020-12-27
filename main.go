package main

import (
	"encoding/csv"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/rwcarlsen/goexif/exif"
)

func getFootCandlesFromImage(filename string) float64 {
	ISOVal, FNumberFloat, ExposureTimeFloat := getEXIFData(filename)

	// luminance approximation formula found: https://www.conservationphysics.org/lightmtr/luxmtr1.html
	lux := 50 * FNumberFloat * FNumberFloat / (ExposureTimeFloat * float64(ISOVal))

	// convert lux to foot-candles
	return lux / 10.76
}

// returns the ISO value and the EVFloat from the EXIF metadata
func getEXIFData(filename string) (int, float64, float64) {
	f, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}

	x, err := exif.Decode(f)
	if err != nil {
		log.Fatal(err)
	}

	// fmt.Println(x.String())

	ISO, _ := x.Get(exif.ISOSpeedRatings)
	ISOVal, _ := ISO.Int(0)

	FNumber, _ := x.Get(exif.FNumber)
	num, den, _ := FNumber.Rat2(0)

	FNumberFloat := float64(num) / float64(den)
	// FNumber
	// ExposureTime

	ExposureTime, _ := x.Get(exif.ExposureTime)
	num, den, _ = ExposureTime.Rat2(0)

	ExposureTimeFloat := float64(num) / float64(den)
	return ISOVal, FNumberFloat, ExposureTimeFloat
}

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
