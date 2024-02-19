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
  { name: "2009", value: 100 },
  { name: "2010", value: 253 },
  { name: "2011", value: 345 },
  { name: "2012", value: 321 },
  { name: "2013", value: 1000 },
  { name: "2014", value: 324 },
  { name: "2015", value: 124 },
  { name: "2016", value: 325 },
  { name: "2017", value: 500 },
  { name: "2018", value: 325 },
  { name: "2019", value: 245 },
  { name: "2020", value: 600 },
  { name: "2021", value: 100 },
  { name: "2022", value: 343 },
  { name: "2023", value: 200 },
  { name: "2024", value: 100 },
];

export default function Netflix() {
  return (
    <>
      <YearSelector />
      <Totals />
      <TimeSpentBy timeSpentData={byYear} />
      <div className="container">
        <div className="row row-cols-sm-1 row-cols-lg-3">
          <PaddedPieChart pieDatum={comparisonMoviesTv} />
          <Table tableData={deviceData} tableHeaders={deviceHeaders} />
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
      <div class="col card border-danger mb-3 mx-2">
        <div class="card-body text-danger">
          <h5 class="card-title">{total.title}</h5>
          <p class="card-text">{total.count}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <div className="row">{cards}</div>
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

const Table = ({ tableData, tableHeaders }) => {
  const tHead = tableHeaders.map((head) => {
    return <th scope="col">{head}</th>;
  });
  const tData = tableData.map((data) => {
    return (
      <tr>
        <td>{data.name}</td>
        <td>{data.value}</td>
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
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={timeSpentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#b81d24" />
      </BarChart>
    </ResponsiveContainer>
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
