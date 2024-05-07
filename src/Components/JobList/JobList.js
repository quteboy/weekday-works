import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Paper,
  Grid,
  Stack,
  Box,
  Dialog,
  DialogContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListSubheader,
  Chip,
  OutlinedInput,
} from "@mui/material";
import data from "../../Utils/data.json";
import roleData from "../../Utils/Roles.json";
import teamsSize from "../../Utils/companySize.json";
import jobType from "../../Utils/JobType.json";
import tStack from "../../Utils/techStack.json";
import pScale from "../../Utils/basePay.json";
import axios from "axios";
import "./JobList.css";
const JobList = () => {
  const [jobList, setJobList] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [singleJobItem, setSingleJobItem] = useState(null);
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [roleList, setRoleList] = useState(roleData);
  const [companySize, setCompanySize] = useState(teamsSize);
  const [selectedSize, setSelectedSize] = useState("");
  const [workMode, setWorkMode] = useState(jobType);
  const [selectedMode, setSelectedMode] = useState("Remote");
  const [techStackList, setTechStackList] = useState(tStack);
  const [selectedTechStack, setSelectedTechStack] = useState("");
  const [payScale, setPayScale] = useState(pScale);
  const [selectedPay, setSelectedPay] = useState("");
  const [companyName, setCompanyName] = useState("");
  const fetchJobs = async () => {
    let data = JSON.stringify({
      limit: 10,
      offset: 0,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.weekday.technology/adhoc/getSampleJdJSON",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        var data = response.data.jdList;
        setJobList(data);
        console.log("data", data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchJobs();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  useEffect(() => {
    fetchJobs();
  }, []);
  const handleModal = (item) => {
    setViewModal(!viewModal);
    setSingleJobItem(item);
  };
  /// chip code
  const ITEM_HEIGHT = 35;
  const ITEM_PADDING_TOP = 5;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
    MenuListProps: { disablePadding: true },
  };
  const filterJobsByRoles = (jobs, selectedRoles) => {
    if (!selectedRoles.length) return jobs;

    console.log("Selected Roles:", selectedRoles);
    console.log("jobs", jobs);
    const lowercaseSelectedRoles = selectedRoles.map((role) =>
      role.toLowerCase()
    );
    console.log("Lowercase Selected Roles:", lowercaseSelectedRoles);

    const filteredJobs = jobs.filter((job) =>
      lowercaseSelectedRoles.includes(job.jobRole)
    );

    console.log("Filtered Jobs:", filteredJobs);

    return filteredJobs;
  };
  const handleRoleChange = (event) => {
    const { value: selected } = event.target;
    console.log("value", selected);
    setSelectedRole(selected);
    console.log("jobList", jobList);
    const filteredJobs = filterJobsByRoles(jobList, selected);
    console.log("filteredJobs", filteredJobs);
    setJobList(filteredJobs);
  };

  const handleDelete = (value) => {
    const updatedRoles = selectedRole.filter((role) => role !== value);
    setSelectedRole(updatedRoles);
    const filteredJobs = filterJobsByRoles(jobList, updatedRoles);
    setJobList(filteredJobs);
    if (updatedRoles.length == 0) {
      setJobList(jobList);
    }
    console.log("updatedRoles", updatedRoles);
    console.log("filteredJobs", filteredJobs);
  };
  const handleCompanySize = (event) => {
    setSelectedSize(event.target.value);
  };
  const handleJobType = (event) => {
    setSelectedMode(event.target.value);
  };
  const handleTechStack = (event) => {
    setSelectedTechStack(event.target.value);
  };
  const handlePayScale = (event) => {
    var minPay = event.target.value;
    console.log("minPay", minPay);
    const updatedArr = jobList.filter((item) => item.minJdSalary >= minPay);
    setJobList(updatedArr);
    console.log("updatedArr", updatedArr);
    setSelectedPay(event.target.value);
  };
  const handleCompanyName = (event) => {
    console.log("event", event.target.value);
    setCompanyName(event.target.name);
    var compName = event.target.value;
    if (compName.length >= 2) {
      const updatedArr = jobList.filter((item) =>
        item.companyName.toLowerCase().includes(compName)
      );
      setJobList(updatedArr);
    } else {
      setJobList(jobList);
    }
  };
  return (
    <React.Fragment>
      <Grid
        px={3}
        py={2}
        container
        direction="row"
        alignItems="flex-start"
        justifyContent='space-between'
        spacing={4}
      >
        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              label="Select Role"
              className="jobFilter_wdt"
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      onDelete={(e) => {
                        console.log("i am invoked");
                        handleDelete(value);
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {roleList.map((rItem) => [
                <ListSubheader key={rItem.groupName}>
                  {rItem.groupName}
                </ListSubheader>,
                rItem.options.map((optItem) => (
                  <MenuItem key={optItem} value={optItem}>
                    {optItem}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={2}>
          <FormControl fullWidth>
            <InputLabel>Number of Employees</InputLabel>
            <Select
              value={selectedSize}
              onChange={handleCompanySize}
              label="Number of Employees"
              className="jobFilter_wdt"
            >
              {companySize.map((item, index) => {
                return (
                  <MenuItem key={item.id} value={item.size}>
                    {item.size}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <Select
              value={selectedMode}
              onChange={handleJobType}
              //label="Number of Employees"
              className="jobFilter_wdt"
            >
              {workMode.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.jobType}>
                    {item.jobType}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={2}>
          <FormControl fullWidth>
            <InputLabel>Tech Stack</InputLabel>
            <Select
              value={selectedTechStack}
              onChange={handleTechStack}
              label="Tech Stack"
              className="jobFilter_wdt"
            >
              {techStackList.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.techStack}>
                    {item.techStack}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={2}>
          <FormControl fullWidth>
            <InputLabel>Minimum Base Salary</InputLabel>
            <Select
              value={selectedPay}
              onChange={handlePayScale}
              label="Minimum Base Salary"
              className="jobFilter_wdt"
            >
              {payScale.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.payScale}>
                    {item.payScale}L
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={2}>
          <FormControl fullWidth>
            <InputLabel>Search Company Name</InputLabel>
            <OutlinedInput
              placeholder="Search Company Name"
              label="Search Company Name"
              onChange={handleCompanyName}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        px={3}
        py={2}
        container
        direction="row"
        alignItems="flex-start"
        spacing={4}
      >
        {jobList.map((jItem) => {
          return (
            <Grid key={jItem.jdUid} item lg={4} md={6} sm={12} xs={24}>
              <Card className="jobCard" component={Paper} elevation={3}>
                <Stack direction="row" alignItems="flex-start" spacing={2}>
                  <img
                    className="jobCard_Logo"
                    src={jItem?.logoUrl}
                    alt={jItem?.companyName}
                  />
                  <Stack direction="column" spacing={0.5}>
                    <div className="jobCard_Name">{jItem?.companyName}</div>
                    <div className="jobCard_Position">{jItem?.jobRole}</div>
                    <div className="jobCard_Location">{jItem?.location}</div>
                  </Stack>
                </Stack>
                <Box my={2}>
                  <Stack
                    mb={2}
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <div>Estimated Salary:</div>{" "}
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      {jItem?.minJdSalary !== null && (
                        <div className="jobCard_Salary">
                          {jItem?.minJdSalary}
                        </div>
                      )}
                      {jItem?.minJdSalary !== null && (
                        <div className="jobCard_Salary">-</div>
                      )}
                      {jItem?.maxJdSalary !== null && (
                        <div className="jobCard_Salary">
                          {jItem?.maxJdSalary + " " + jItem?.salaryCurrencyCode}
                        </div>
                      )}
                    </Stack>
                  </Stack>
                  <Box>
                    <div className="jobCard_AbtComp">About Company:</div>
                    <div className="jobCard_AbtUS">About us</div>
                    <div className="jobCard_JD">
                      {jItem.jobDetailsFromCompany}
                    </div>
                  </Box>
                  <div className="buttons-overlay"></div>
                  <div className="buttons">
                    <Button
                      onClick={() => {
                        handleModal(jItem);
                      }}
                      variant="text"
                      className="jobCard_ViewBtb"
                    >
                      View Details
                    </Button>
                  </div>
                  {jItem?.maxExp !== null && (
                    <Box mb={2} className="jobCard_Min_Exp">
                      <div className="jobCard_Min_Exp_Heading">
                        Minimum Experience
                      </div>
                      <div className="jobCard_Min_Exp_Value">
                        {jItem?.maxExp}
                      </div>
                    </Box>
                  )}

                  <div className="buttons">
                    <Button fullWidth>⚡ Easy Apply</Button>
                  </div>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog fullWidth maxWidth="md" open={viewModal} onClose={handleModal}>
        <DialogContent>
          <Typography mb={1} fontWeight={500} variant="h5" align="center">
            Job Description
          </Typography>
          <div className="jobCard_AbtComp">About Company:</div>
          <div className="jobCard_AbtUS">About us</div>
          <Typography mt={1} className="jobCard_JD">
            {singleJobItem?.jobDetailsFromCompany}
          </Typography>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default JobList;
