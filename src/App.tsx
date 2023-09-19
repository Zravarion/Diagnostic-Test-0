import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Menu, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

/**
 * You will find globals from this file useful!
 */
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID } from "./globals";
import { IUniversityClass, Info } from "./types/api_types";
import { get } from "http";
import { calculateStudentFinalGrade } from "./utils/calculate_grade";
import {GradeTable} from "./components/GradeTable"

function App() {
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [currRows, setRows] = useState<any[]>([])

  const semester = "fall2022"

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Student ID', width: 150 },
    { field: 'name', headerName: 'Student Name', width: 150 },
    { field: 'classId', headerName: 'Class ID', width: 150 },
    { field: 'className', headerName: 'Class Name', width: 150 },
    { field: 'semester', headerName: 'Semester', width: 150 },
    { field: 'finalGrade', headerName: 'Final Grade', width: 150 },
  ];

  useEffect(() => {
    const fetchClassList = async () => {
      const classes: IUniversityClass[] = await getClasses();
      setClassList(classes);
    }
    fetchClassList();
  }, []);

  const getClass = async () => {
    const res = await fetch(BASE_API_URL + "/class/GetById/" + currClassId + "?buid=" + MY_BU_ID, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS()
    });
    const json = await res.json();
    return json;
  }

  useEffect(() => {
    if (currClassId === "") {
    }
    else {
      
      const fetchInfo = async (id: string) => {
        const res = await fetch(BASE_API_URL + "/student/listGrades/" + id + "/" + currClassId + "/?buid=" + MY_BU_ID, {
          method: "GET",
          headers: GET_DEFAULT_HEADERS()
        });
        const json = await res.json();
        const c = await getClass();
        let row = { id: id, name: json.name, classId: currClassId, className: c.title, semester: semester, finalGrade: await calculateStudentFinalGrade(id, c) };
        return row;
      }
      const getBUIDs = async () => {
        const res = await fetch(BASE_API_URL + "/class/listStudents/" + currClassId + "?buid=" + MY_BU_ID, {
          method: "GET",
          headers: GET_DEFAULT_HEADERS()
        });
        const json = await res.json();
        return json;
      }
      
      const getRows = async () => {
        const buids: string[] = await getBUIDs();
        let rows:any[] = [];
        buids.forEach(async(element: string) => {
          const row = await fetchInfo(element);
          rows = Object.assign([],rows)
          rows.push(row)
          setRows(rows)
        });
      }
      getRows();
      
      GradeTable(currRows,columns);
    }
  }, [currClassId])

  const getClasses = async () => {
    const res = await fetch(BASE_API_URL + "/class/listBySemester/fall2022?buid=U67819144", {
      method: "GET",
      headers: GET_DEFAULT_HEADERS()
    });
    const json = await res.json();
    return json;
  }
  const opts = classList.map(item => {
    return { value: item.classId, label: item.title }
  });

  const handleSelectChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    setCurrClassId(newValue);
    GradeTable(currRows,columns);
  };

  

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
          <div style={{ width: "100%" ,height:"100"}}>
            {
              <Select value={currClassId} fullWidth={true} label="Class" onChange={handleSelectChange}>
                {classList.map((item) => (
                  <MenuItem value={item.classId} key={item.classId}>{item.title}</MenuItem>))}
              </Select>
            }
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <div style={{height: 700,width:'100%'}}>
            
            <DataGrid rows={currRows} columns={columns}/>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
