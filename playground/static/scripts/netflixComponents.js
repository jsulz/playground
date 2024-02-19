import React from "react";
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

const comparisonMoviesTv = [
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
];

const deviceData = [
  { name: "Samsung TV", value: 3232 },
  { name: "PC", value: 2322 },
  { name: "iPad", value: 52 },
  { name: "Macbook Pro", value: 583 },
];

const deviceHeaders = ["Device Name", "Total Views"];

const countryData = [
  { name: "United States", value: 5600 },
  { name: "Nepal", value: 21 },
  { name: "Nicaragua", value: 50 },
  { name: "Spain", value: 32 },
  { name: "Mexico", value: 4 },
];

const countryHeaders = ["Country", "Total Views"];

const topWatches = [
  { name: "The Office", episodesWatched: 201, totalDuration: 500 },
  {
    name: "Star Trek: DS9",
    episodesWatched: 154,
    totalDuration: 175,
  },
  { name: "Star Trek: Voyager", episodesWatched: 124, totalDuration: 130 },
  { name: "Parks and Recreation", episodesWatched: 100, totalDuration: 50 },
  { name: "Breaking Bad", episodesWatched: 90, totalDuration: 80 },
];

const topWatchesHeaders = [
  "Show Title",
  "Episodes Watched",
  "Total Hours Watched",
  "See Deep Dive",
];

const byYearDeepDive = [
  {
    name: "year",
    children: [
      { name: "2009", size: 100 },
      { name: "2010", size: 253 },
      { name: "2011", size: 345 },
      { name: "2012", size: 321 },
      { name: "2013", size: 1000 },
      { name: "2014", size: 324 },
      { name: "2015", size: 124 },
      { name: "2016", size: 325 },
      { name: "2017", size: 500 },
      { name: "2018", size: 325 },
      { name: "2019", size: 245 },
      { name: "2020", size: 600 },
      { name: "2021", size: 100 },
      { name: "2022", size: 343 },
      { name: "2023", size: 200 },
      { name: "2024", size: 100 },
    ],
  },
];

const byYear = [
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
];

export default function Netflix() {
  return (
    <>
      <YearSelector />
      <Totals />
      <TimeSpentBy timeSpentData={byYear} />
      <div className="text-center container mb-5 ">
        <h2>Watching Activity by Movies / Television</h2>
        <div className="row row-cols-sm-1 row-cols-md-2">
          <PaddedPieChart pieDatum={comparisonMoviesTv} />
        </div>
        <div className="container text-center mb-5 ">
          <h2 className="text-center">
            Watching Activity by Device & Location
          </h2>
          <div className="row row-cols-sm-1 row-cols-md-2">
            <Table
              tableData={deviceData}
              tableHeaders={deviceHeaders}
              deepDive={false}
            />
            <Table
              tableData={countryData}
              tableHeaders={countryHeaders}
              deepDive={false}
            />
          </div>
        </div>
        <div className="container text-center mb-5 ">
          <h2 className="text-center">Top Watches on Netflix</h2>
          <div className="row">
            <Table
              tableData={topWatches}
              tableHeaders={topWatchesHeaders}
              deepDive={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

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

const Totals = () => {
  const totals = [
    { title: "Movies + TV Episodes Watched", count: 4588 },
    { title: "Hours Watched", count: 1000 },
  ];
  const cards = totals.map((total) => {
    return (
      <div class="col card border-danger mx-2">
        <div class="card-body text-danger">
          <h5 class="card-title">{total.title}</h5>
          <p class="card-text">{total.count}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <div className="row mb-5">{cards}</div>
    </div>
  );
};

const PaddedPieChart = ({ pieDatum }) => {
  const COLORS = ["#E50914", "#E6B208"];
  const charts = pieDatum.map((pieData) => {
    return (
      <div className="col">
        <h6>{pieData.title}</h6>
        {console.log(pieData.data)}
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
                console.log(COLORS[index % COLORS.length]);
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

const DeepDiveBtn = ({ name }) => {
  return (
    <button type="button" class="btn btn-danger">
      <i class="bi bi-graph-up-arrow"></i>
    </button>
  );
};

const TimeSpentBy = ({ timeSpentData }) => {
  return (
    <div className="text-center container mb-3">
      <h2>
        Time Spent by <TimeSpentSelector />
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={timeSpentData}>
          <CartesianGrid strokeDasharray="3 3" />
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

const TimeSpentSelector = () => {
  return (
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-danger dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Year
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" href="#">
            Month
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#">
            Day
          </a>
        </li>
      </ul>
    </div>
  );
};

const DeepDiveTimeSpentBy = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <Treemap
        width={400}
        height={200}
        data={byYear}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        fill="#b81d24"
      >
        <Tooltip />
      </Treemap>
    </ResponsiveContainer>
  );
};
