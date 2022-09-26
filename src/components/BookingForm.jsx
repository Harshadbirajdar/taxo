import { Autocomplete } from "@react-google-maps/api";
import React, { useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import geocode from "react-geocode";
import usestepStore from "../store/step";
import useRouteStore from "../store/route";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { MapPinIcon } from "@heroicons/react/24/outline";
import axios from "axios";
const BookingForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      source: "",
      destination: "",
      pickupTime: new Date().toISOString().substring(0, 16),
    },
  });
  const { current, setStep } = usestepStore((state) => ({
    current: state.current,
    setStep: state.setStep,
  }));
  const { setRoute, setDirection, setLoading } = useRouteStore((state) => ({
    setRoute: state.setRoute,
    setDirection: state.setDirection,
    setLoading: state.setLoading,
  }));

  const checkLocationAccess = () => {
    if (!navigator.geolocation) {
      console.log("Location access failed!");
      return;
    }
    navigator.geolocation.getCurrentPosition(accessCurrentLocation, (error) => {
      console.log("Location access failed!");
    });
  };

  const accessCurrentLocation = (position) => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    geocode.setApiKey(process.env.REACT_APP_MAP_API_KEY);
    geocode.fromLatLng(lat, lng).then(
      (response) => {
        setValue("source", response.results[0].formatted_address);
      },
      (error) => {
        console.log(error);
        toast.error("Location detection failed!");
      }
    );
  };

  const calculateRoute = async (data) => {
    setDirection(null);
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: data.source,
        destination: data.destination,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      console.log(results);
      getToolPrice(results);
      setDirection(results);
      setRoute({
        distance: results.routes[0].legs[0].distance.text,
        duration: results.routes[0].legs[0].duration.text,
        distanceValue: results.routes[0].legs[0].distance.value,
        pickupTime: data.pickupTime,
      });
      setStep("Book");
    } catch (e) {
      console.log(e);
      toast.error(
        e.code === "ZERO_RESULTS"
          ? "No route could be found between the origin and destination."
          : "Something Went wrong"
      );
    }
  };

  const getToolPrice = (results) => {
    setLoading(true);
    axios
      .post(
        "https://dev.tollguru.com/v1/calc/here",
        {
          from: {
            lat: results.routes[0].legs[0]?.start_location.lat(),
            lng: results.routes[0].legs[0]?.start_location.lng(),
          },
          to: {
            lat: results.routes[0].legs[0]?.end_location.lat(),
            lng: results.routes[0].legs[0]?.end_location.lng(),
          },
          vehicleType: "2AxlesAuto",
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_TOOL_API_KEY,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        let tolls = [];
        res.data.routes.map((route) => {
          tolls.push(...route.tolls);
        });

        let totalToll = 0;
        console.log(tolls);
        tolls.map((toll) => {
          console.log(toll);
          totalToll = totalToll + toll.tagOneWay;
        });
        setRoute({
          toll: totalToll,
        });
      })
      .catch((er) => {
        setLoading(false);
        console.log(er);
      });
  };
  if (current === "Form")
    return (
      <div className="absolute top-24 left-7">
        <div className="bg-white py-9 px-2 w-80 rounded-lg shadow hover:shadow-xl">
          <h1 className="text-3xl font-bold leading-10 mt-0 mb-6 underline-offset-3 underline text-center">
            Taxo
          </h1>
          <Autocomplete>
            <Input
              error={errors.source}
              {...register("source", {
                required: {
                  value: true,
                  message: "Please enter a Source",
                },
              })}
              label="source *"
              endIcon={
                <MapPinIcon
                  className="w-6 mr-2 cursor-pointer"
                  onClick={checkLocationAccess}
                />
              }
            ></Input>
          </Autocomplete>
          <Autocomplete>
            <Input
              error={errors.destination}
              {...register("destination", {
                required: {
                  value: true,
                  message: "Please enter Destination",
                },
              })}
              label="destination *"
            ></Input>
          </Autocomplete>
          <Input
            {...register("pickupTime", {
              required: {
                value: true,
                message: "Please select Pickup Date And Time",
              },
            })}
            label="Pickup Date & Time *"
            type="datetime-local"
            min={new Date().toISOString().substring(0, 16)}
          ></Input>
          <Button className="w-full " onClick={handleSubmit(calculateRoute)}>
            Check Fare
          </Button>
        </div>
      </div>
    );
};

export default BookingForm;
