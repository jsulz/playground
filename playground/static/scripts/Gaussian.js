import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function Gaussian() {
    let arr = data();
    console.log(arr);
    return (
      <LineChart width={800} height={600} data={arr}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis />
            <YAxis />
      </LineChart>
    );
}

const data = () => {

    const x = [];
    for (let i = 0; i < 10; i += .1){
        // sigma is 2
        const sigma = 2
        const mu = 10
        let a = 1 / (sigma * Math.sqrt(2 * Math.PI) )
        let b = -(1/2) * Math.pow( (i - mu / sigma ), 2)
        let f_x = a * Math.pow(Math.E, b)

        x.push({uv: f_x });
    }
    if(x.length == 101){
        return x
    }
    console.log(x)
}