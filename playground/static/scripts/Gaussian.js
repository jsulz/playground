import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Gaussian() {
  const [gauss, setGauss] = useState({ mu: 10, sigma: 2 });
  const pdf_data = gauss_pdf(gauss["mu"], gauss["sigma"]);
  const cdf_data = gauss_cdf(gauss["mu"], gauss["sigma"]);

  return (
    <>
      <LineCreate newLine={setGauss} />
      <GaussChart title="Probability Distribution Function" data={pdf_data} />
      <GaussChart title="Cumulative Distribution Function" data={cdf_data} />
    </>
  );
}

const GaussChart = ({ title, data }) => {
  return (
    <div className="mb-3">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart width={800} height={600} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="val" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineCreate = ({ newLine }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    newLine({ mu: parseFloat(formJson.mu), sigma: parseFloat(formJson.sigma) });
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-8 mb-3">
            <label for="mu" className="form-label">
              Mu
            </label>
            <input
              type="text"
              name="mu"
              id="mu"
              className="form-control"
              required
            />
          </div>
          <div className="col-8 mb-3">
            <label for="sigma" className="form-label">
              Sigma
            </label>
            <input
              type="text"
              name="sigma"
              id="sigma"
              className="form-control"
              required
            />
          </div>
          <div className="row">
            <button type="submit" className="col-3 mb-4 mx-3  btn btn-primary">
              Create Line
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const gauss_pdf = (mu, sigma) => {
  const x = [];
  const for_start = mu - 4 * sigma;
  const for_stop = mu + 4 * sigma;
  for (let i = for_start; i < for_stop; i += (for_stop - for_start) / 50) {
    // sigma is 2
    let a = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI));
    let b = -(1 / 2) * Math.pow((i - mu) / sigma, 2.0);
    let f_x = a * Math.pow(Math.E, b);
    x.push({ val: i.toFixed(3), uv: f_x.toFixed(3) });
  }
  return x;
};

const gauss_cdf = (mu, sigma) => {
  const x = [];
  const for_start = mu - 4 * sigma;
  const for_stop = mu + 4 * sigma;
  for (let i = for_start; i < for_stop; i += (for_stop - for_start) / 50) {
    let point = 0.5 * (1 + erf((i - mu) / (sigma * Math.sqrt(2.0))));
    x.push({ val: i.toFixed(3), uv: point.toFixed(3) });
  }
  return x;
};

const erf = (i) => {
  let z = Math.abs(i);
  let t = 1 / (1 + z / 2);
  var r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t * (-0.82215223 + t * 0.17087277))))))))
    );
  return i >= 0 ? 1 - r : r - 1;
};
