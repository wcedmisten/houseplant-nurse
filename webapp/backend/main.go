package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/pgxpool"

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
	httpsRouter := gin.Default()
	httpRouter := gin.Default()

	httpRouter.GET("/*path", func(c *gin.Context) {
		c.Redirect(302, "https://localhost/"+c.Param("variable"))
	})

	// Serve frontend static files
	httpsRouter.Use(static.Serve("/", static.LocalFile("./client/build", true)))

	// Setup route group for the API
	api := httpsRouter.Group("/api")

	api.GET("/plants", PlantHandler)

	api.GET("/search", SearchHandler)

	go httpsRouter.RunTLS(":443", "/certs/localhost.crt", "/certs/localhost.key")
	httpRouter.Run(":80")
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

	databaseURL := os.Getenv("DATABASE_URL")

	dbpool, err := pgxpool.Connect(context.Background(), databaseURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	var id, scientific_name, common_name, light, temperature, humidity, watering, soil string
	rows, err := dbpool.Query(context.Background(), "select * from plant_data;")
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	for rows.Next() {
		rows.Scan(&id, &scientific_name, &common_name, &light, &temperature, &humidity, &watering, &soil)

		id, _ := strconv.Atoi(id)

		a = append(a, Plant{
			id, scientific_name, common_name, light, temperature, humidity, watering, soil,
		})
	}

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"plants": a,
	})
}

func SearchHandler(c *gin.Context) {
	var a []Plant

	searchName := c.Query("name") // shortcut for c.Request.URL.Query().Get("name")

	databaseURL := os.Getenv("DATABASE_URL")

	dbpool, err := pgxpool.Connect(context.Background(), databaseURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	var id, scientific_name, common_name, light, temperature, humidity, watering, soil string

	rows, err := dbpool.Query(context.Background(), "SELECT * FROM plant_data ORDER BY SIMILARITY(common_name, $1) DESC LIMIT 5;", searchName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	for rows.Next() {
		rows.Scan(&id, &scientific_name, &common_name, &light, &temperature, &humidity, &watering, &soil)

		id, _ := strconv.Atoi(id)

		a = append(a, Plant{
			id, scientific_name, common_name, light, temperature, humidity, watering, soil,
		})
	}

	// return an empty list if no matches exist
	if a == nil {
		a = make([]Plant, 0)
	}

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"plants": a,
	})
}
