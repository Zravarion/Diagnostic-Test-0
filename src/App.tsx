import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

/**
 * You will find globals from this file useful!
 */
import { BASE_API_URL, GET_DEFAULT_HEADERS } from "./globals";
import { IUniversityClass, Student } from "./types/api_types";
import { get } from "http";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [currRows, setRows] = useState<Student[]>()
  
  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *g
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  /*
  const fetchSomeData = async () => {
    const res = await fetch("https://cat-fact.herokuapp.com/facts/", {
      method: "GET",
    });
    const json = await res.json();
    console.log(json);
  };
  fetchSomeData();
  */

  useEffect(() => {
    const fetchClassList = async () => {
      const classes = await getClasses();
      setClassList(classes);
    }
    fetchClassList();
  },[]);

  const getClasses = async () => {
    const res = await fetch(BASE_API_URL+"/class/listBySemester/fall2022?buid=U67819144",{
      method: "GET",
      headers: GET_DEFAULT_HEADERS()
    });
    const json = await res.json();
    const classes: IUniversityClass[] = json.map((data:any) => {
      return {
        classId: data.classId,
        title: data.title,
        description: data.description,
        meetingTime: data.meetingTime,
        meetingLocation: data.meetingLocation,
        status: data.status,
        semester: data.semester,
      };
    });
    return classes;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            {/*
            <Select fullWidth={true} label="Class">
              {
              
              }
              
            </Select>
  */}
          
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <div>Place the grade table here</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
