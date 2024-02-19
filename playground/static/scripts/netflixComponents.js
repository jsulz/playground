import React, { useEffect, useState } from "react";
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

export default function Netflix() {
  const [apiData, setApiData] = useState({});
  const [year, setYear] = useState(2009);

  useEffect(() => {
    const paramString = "start_year=" + year;
    const params = new URLSearchParams(paramString);
    let active = true;
    fetch("/netflix/api/v1/deepdive?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setApiData(data);
        }
      });

    return () => {
      active = false;
    };
  }, [year]);

  const handleOnChange = (e) => {
    setYear(e.target.value);
  };
  if (apiData.totals) {
    return (
      <>
        <YearSelector year={year} handleOnChange={handleOnChange} />
        <Totals totalData={apiData.totals} />
        <TimeSpentBy timeSpentData={apiData.timeSpentBy} />
        <DataRow
          headingText="Watching Activity by Movies / Television"
          columns={2}
        >
          <PaddedPieChart pieDatum={apiData.comparisonMoviesTv} />
        </DataRow>
        <DataRow headingText="Top Watches on Netflix" columns={1}>
          <TopWatches topWatchData={apiData.topWatches} />
        </DataRow>
        <DataRow
          headingText="Watching Activity by Device & Location"
          columns={2}
        >
          <Table
            tableData={apiData.devices.deviceData}
            tableHeaders={apiData.devices.deviceHeaders}
            deepDive={false}
          />
          <Table
            tableData={apiData.countries.countriesData}
            tableHeaders={apiData.countries.countriesHeaders}
            deepDive={false}
          />
        </DataRow>
      </>
    );
  }
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
const YearSelector = ({ year, handleOnChange }) => {
  const [shownYear, setShownYear] = useState(2009);

  const handleRangeChange = (e) => {
    setShownYear(e.target.value);
  };
  return (
    <div className="row mb-3">
      <div className="col-12 text-center">
        <h2>
          {shownYear} - {endYear}
        </h2>
      </div>
      <input
        type="range"
        className="form-range"
        min={startYear}
        max={endYear}
        step="1"
        id="customRange3"
        value={shownYear}
        onMouseUp={handleOnChange}
        onChange={handleRangeChange}
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
        <BarChart data={timeSpentData[timePeriod]} margin={{ bottom: 60 }}>
          <XAxis dataKey="name" angle={40} tickMargin={20} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="hours" fill="#b81d24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TimeSpentSelector = ({ time, handleOnClick }) => {
  const periods = ["Month", "Day", "Year"];
  const dropdown = periods.map((period) => {
    if (period !== time.slice(2)) {
      return (
        <li onClick={handleOnClick}>
          <a class="dropdown-item" href="#">
            {period}
          </a>
        </li>
      );
    }
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
    <ResponsiveContainer width="100%" height={800}>
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
