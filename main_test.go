package main

import (
	"fmt"
	"testing"
)

func TestExifData(t *testing.T) {
	ISOVal, FNumberFloat, ExposureTimeFloat := getEXIFData("/home/wce/Downloads/IMG_20201225_204432.jpg")
	// ISOVal, FNumberFloat, ExposureTimeFloat := getEXIFData("/home/wce/Downloads/IMG_20200510_151630.jpg")

	if ISOVal != 1250 {
		t.Error(fmt.Sprintf("Expected ISO of %d but got %d", 1250, ISOVal))
	}

	if FNumberFloat != 1.7 {
		t.Error(fmt.Sprintf("Expected EV of %f but got %f", 1.7, FNumberFloat))
	}

	if ExposureTimeFloat != .02 {
		t.Error(fmt.Sprintf("Expected EV of %f but got %f", .02, ExposureTimeFloat))
	}
}

func TestFootCandles(t *testing.T) {
	fmt.Println(getFootCandlesFromImage("/home/wce/Downloads/IMG_20200510_151630.jpg"))
}
