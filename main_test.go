package main

import (
	"fmt"
	"testing"
)

func TestGetLuxLuminance(t *testing.T) {
	var luxVals = map[float64]float64{
		-1.0: 1.25,
		0.0:  2.5,
		1.0:  5.0,
		5.0:  80.0,
		10.0: 2560.0,
	}

	for k, v := range luxVals {
		lux := getLuxLuminance(k)
		if lux != v {
			t.Error(fmt.Sprintf("Expected %f but got %f", v, lux)) // to indicate test failed
		}
	}
}

func TestGetEV100(t *testing.T) {
	EV100from200 := getEV100(200.0, 9.0)
	if EV100from200 != 8.0 {
		t.Error(fmt.Sprintf("Expected adjusted EV of %f but got %f", 8.0, EV100from200))
	}

	EV100from400 := getEV100(400.0, 3.0)
	if EV100from400 != 1.0 {
		t.Error(fmt.Sprintf("Expected adjusted EV of %f but got %f", 8.0, EV100from400))
	}
}
