import React, { useState } from "react";
import {
  Pie,
  PieChart,
  Cell,
  Sector,
  Tooltip,
  ResponsiveContainer,
  Treemap,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
} from "recharts";

const startYear = 2009;
const endYear = 2024;

const APIDATA = {
  totals: [
    { title: "Movies + TV Episodes Watched", count: 4588 },
    { title: "Hours Watched", count: 1000 },
  ],
  timeSpentBy: {
    byYear: [
      { name: "2009", hours: 100 },
      { name: "2010", hours: 253 },
      { name: "2011", hours: 345 },
      { name: "2012", hours: 321 },
      { name: "2013", hours: 1000 },
      { name: "2014", hours: 324 },
      { name: "2015", hours: 124 },
      { name: "2016", hours: 325 },
      { name: "2017", hours: 500 },
      { name: "2018", hours: 325 },
      { name: "2019", hours: 245 },
      { name: "2020", hours: 600 },
      { name: "2021", hours: 100 },
      { name: "2022", hours: 343 },
      { name: "2023", hours: 200 },
      { name: "2024", hours: 100 },
    ],
    byMonth: [
      { name: "January", hours: 502 },
      { name: "February", hours: 720 },
      { name: "March", hours: 400 },
      { name: "April", hours: 349 },
      { name: "May", hours: 271 },
      { name: "June", hours: 102 },
      { name: "July", hours: 105 },
      { name: "August", hours: 80 },
      { name: "September", hours: 150 },
      { name: "October", hours: 245 },
      { name: "November", hours: 450 },
      { name: "December", hours: 500 },
    ],
    byDay: [
      { name: "Sunday", hours: 1800 },
      { name: "Monday", hours: 345 },
      { name: "Tuesday", hours: 500 },
      { name: "Wednesday", hours: 400 },
      { name: "Thursday", hours: 700 },
      { name: "Friday", hours: 890 },
      { name: "Saturday", hours: 1800 },
    ],
  },
  comparisonMoviesTv: [
    {
      title: "Count of Movies and TV Watched",
      data: [
        { name: "Movies", value: 560 },
        { name: "TV", value: 3580 },
      ],
    },
    {
      title: "Duration of Movies and TV Watched",
      data: [
        { name: "Movies", value: 1000 },
        { name: "TV", value: 3580 },
      ],
    },
  ],
  deviceData: [
    { name: "Samsung TV", value: 3232 },
    { name: "PC", value: 2322 },
    { name: "iPad", value: 52 },
    { name: "Macbook Pro", value: 583 },
  ],
  deviceHeaders: ["Device Name", "Total Views"],
  countryData: [
    { name: "United States", value: 5600 },
    { name: "Nepal", value: 21 },
    { name: "Nicaragua", value: 50 },
    { name: "Spain", value: 32 },
    { name: "Mexico", value: 4 },
  ],
  countryHeaders: ["Country", "Total Views"],
  topWatches: [
    { name: "The Office", duration: 500 },
    { name: "Star Trek: DS9", duration: 175 },
    { name: "Star Trek: Voyager", duration: 130 },
    { name: "Parks and Recreation", duration: 50 },
    { name: "Breaking Bad", duration: 80 },
  ],
};

export default function Netflix() {
  return (
    <>
      <YearSelector />
      <Totals totalData={APIDATA.totals} />
      <TimeSpentBy timeSpentData={APIDATA.timeSpentBy} />
      <DataRow
        headingText="Watching Activity by Movies / Television"
        columns={2}
      >
        <PaddedPieChart pieDatum={APIDATA.comparisonMoviesTv} />
      </DataRow>
      <DataRow headingText="Top Watches on Netflix" columns={1}>
        <TopWatches topWatchData={APIDATA.topWatches} />
      </DataRow>
      <DataRow headingText="Watching Activity by Device & Location" columns={2}>
        <Table
          tableData={APIDATA.deviceData}
          tableHeaders={APIDATA.deviceHeaders}
          deepDive={false}
        />
        <Table
          tableData={APIDATA.countryData}
          tableHeaders={APIDATA.countryHeaders}
          deepDive={false}
        />
      </DataRow>
    </>
  );
}

const DataRow = ({ headingText, columns, children }) => {
  return (
    <div className="text-center container mb-5 ">
      <h2>{headingText}</h2>
      <div className={`row row-cols-1 row-cols-md-${columns}`}>{children}</div>
    </div>
  );
};

// @Todo: Update range handler
const YearSelector = () => {
  return (
    <div className="row mb-3">
      <div className="col-12 text-center">
        <h2>
          {startYear} - {endYear}
        </h2>
      </div>
      <input
        type="range"
        className="form-range"
        min={startYear}
        max={endYear}
        step="1"
        id="customRange3"
        value={startYear}
      ></input>
    </div>
  );
};

const Totals = ({ totalData }) => {
  const cards = totalData.map((total) => {
    return (
      <div class="col">
        <div className="card card border-danger">
          <div class="card-body text-danger">
            <h5 class="card-title">{total.title}</h5>
            <p class="card-text">{total.count}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container text-center">
      <div className="row row-cols-md-2 row-cols-1 mb-5 g-2">{cards}</div>
    </div>
  );
};

const PaddedPieChart = ({ pieDatum }) => {
  const COLORS = ["#E50914", "#E6B208"];
  const charts = pieDatum.map((pieData) => {
    return (
      <div className="col">
        <h6>{pieData.title}</h6>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData.data}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              paddingAngle={5}
            >
              {pieData.data.map((item, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                );
              })}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  });
  return charts;
};

const Table = ({ tableData, tableHeaders, deepDive }) => {
  const tHead = tableHeaders.map((head) => {
    return <th scope="col">{head}</th>;
  });
  const tData = tableData.map((data) => {
    const tds = [];
    for (const property in data) {
      tds.push(<td>{data[property]}</td>);
    }
    return (
      <tr>
        {tds.map((td) => {
          return td;
        })}
        {deepDive && (
          <td>
            <DeepDiveBtn name={data.name} />
          </td>
        )}
      </tr>
    );
  });
  return (
    <div className="col">
      <table className="table table-dark table-hover">
        <thead>
          <tr>{tHead}</tr>
        </thead>
        <tbody>{tData}</tbody>
      </table>
    </div>
  );
};

const TimeSpentBy = ({ timeSpentData }) => {
  const [timePeriod, setTimePeriod] = useState("byYear");
  const handleOnClick = (e) => {
    e.preventDefault();
    setTimePeriod("by" + e.target.innerText);
  };
  return (
    <div className="text-center container mb-3">
      <h2>
        Time Spent by{" "}
        <TimeSpentSelector time={timePeriod} handleOnClick={handleOnClick} />
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={timeSpentData[timePeriod]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#b81d24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TimeSpentSelector = ({ time, handleOnClick }) => {
  const periods = ["Month", "Day"];
  const dropdown = periods.map((period) => {
    return (
      <li onClick={handleOnClick}>
        <a class="dropdown-item" href="#">
          {period}
        </a>
      </li>
    );
  });
  return (
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-danger dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {time.slice(2)}
      </button>
      <ul class="dropdown-menu">{dropdown}</ul>
    </div>
  );
};

const TopWatches = ({ topWatchData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={topWatchData} layout="vertical" margin={{ left: 30 }}>
        <XAxis dataKey="duration" type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="duration" fill="#b81d24" />
      </BarChart>
    </ResponsiveContainer>
  );
};
