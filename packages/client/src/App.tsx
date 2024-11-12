import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, slideFadeConfig } from "@chakra-ui/react";
import styled from "styled-components";
import Filter from "./components/filter";
import { theme, IService } from "./utils";
import Service from "./components/service";
import ServiceApi from "./api/service-api";
import SalesAPI from "./api/sales-api";

function App() {
  const [services, setServices] = useState<IService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<IService>>(
    new Set()
  );
  const [valid, setValid] = useState<boolean>(false);
  const [change, setChange] = useState<number | null>(null);
  const [cpaid, setCpaid] = useState<number | null>(null);

  useEffect(() => {
    retrieveServices();
  }, []);

  const retrieveServices = () => {
    ServiceApi.getAll()
      .then((res) => {
        setServices(res.data.services);
        const categoriesList = res.data.services.map(
          (service: IService) => service.category
        );
        setCategories(categoriesList);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const createSale = (data: any) => {
    SalesAPI.createSale(data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateActiveFilters = (filter: string) => {
    if (activeFilters.has(filter)) {
      setActiveFilters((prev) => {
        prev.delete(filter);
        return new Set(prev);
      });
    } else {
      setActiveFilters((prev) => new Set(prev.add(filter)));
    }
  };

  const updateSelectedServices = (service: IService) => {
    if (selectedServices.has(service)) {
      setSelectedServices((prev) => {
        prev.delete(service);
        return new Set(prev);
      });
    } else {
      setSelectedServices((prev) => new Set(prev.add(service)));
    }
  };

  const filtersList: JSX.Element[] = categories.map((category: string) => (
    <Filter
      key={category}
      title={category}
      handleOnClick={() => updateActiveFilters(category)}
      isActive={activeFilters.has(category)}
    />
  ));
  const filteredServices = services.filter((service) =>
    Array.from(activeFilters).includes(service.category)
  );

  const servicesList = filteredServices.map((service) => (
    <Service
      service={service}
      handleOnClick={() => updateSelectedServices(service)}
      isActive={selectedServices.has(service)}
    />
  ));

  const totalSales = Array.from(selectedServices).reduce(
    (sum, curr) => sum + parseInt(curr.price),
    0
  );

  // useEffect(() => {
  //   if(cpaid !== null) {
  //     setChange(valid ? cpaid - totalSales : null);
  //   }

  // }, [valid, cpaid]);

  const handleTotalSale = (val: string) => {
    console.log(val);
    const isValid = !isNaN(Number(val)) && Number(val) >= totalSales;
    if (!isValid) {
      setValid(false);
      setChange(null);
      setCpaid(null);
      console.log("should not be here");
      return;
    }
    setValid(true);
    setCpaid(Number(val));
    setChange(Number(val) - totalSales);
    console.log(change);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      console.error("tried to submit invalid form");
      return;
    }
    console.log(selectedServices);
    const saleServices = Array.from(selectedServices).map((s) => s._id);

    console.log(saleServices);
    // createSale({
    //   customerName: "",
    //   customerPaid: cpaid,
    //   customerChange: change,
    //   services: [],
    // });
  };

  return (
    <Grid autoFlow="row dense" gridTemplateRows={"20vh 80vh"}>
      <Box
        backgroundImage="url('banner.avif')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      />
      <Box p={"2vh 20vw"}>
        <h1 style={{ fontSize: theme.fontSizes.md }}>New Sale</h1>
        <h2 style={{ fontSize: theme.fontSizes.lg }}>Select Services</h2>

        <Flex className="filters" justify={"space-around"}>
          {filtersList}
        </Flex>
        <Flex flexDir={"column"}>{servicesList}</Flex>

        <div>Total: {totalSales}</div>

        <div style={{ float: "right" }}>
          <form style={{ display: "flex", flexDirection: "column" }}>
            <Flex
              flexDir={"row"}
              justify="space-between"
              gap={"2rem"}
              marginBottom={"0.5rem"}
            >
              <label>Customer Paid</label>
              <input
                required
                type="text"
                style={{ border: "1.5px solid green", borderRadius: "10px" }}
                onBlur={(e) => handleTotalSale(e.target.value)}
              />
              <p>{valid ? "ok" : "must be a number"}</p>
            </Flex>
            <Flex flexDir={"row"} justify="space-between">
              <label>Change</label>
              <input
                disabled
                value={change != null ? change : ""}
                type="text"
                style={{ border: "1.5px solid red", borderRadius: "10px" }}
              />
            </Flex>
            <button onClick={(e) => handleSubmit(e)}>Create a Sale</button>
          </form>
        </div>
      </Box>
    </Grid>
  );
}

export default App;
