// IncomeDoughnutChart.js
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';


ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeDoughnutChart = ({ userId }) => {
    const [chartData, setChartData] = useState({
        labels: ['Salary', 'Investments'],
        datasets: [{
            label: 'Income',
            data: new Array(2).fill(0), 
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        }],
    });

    const [chartWidth, setChartWidth] = useState(window.innerWidth < 600 ? 280 : 450);

    useEffect(() => {
        const fetchIncomeData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:8080/api/expenses/getAll?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const expenses = response.data.expenses; 
                    const incomeCategories = {
                        Salary: 0,
                        Investments: 0,
                    };

                    expenses.forEach((expense) => {
                        if (expense.type === 'Income') { 
                            const category = expense.category; 
                            if (incomeCategories.hasOwnProperty(category)) {
                                incomeCategories[category] += expense.amount; 
                            }
                        }
                    });

                    
                    setChartData((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: [
                                incomeCategories.Salary,
                                incomeCategories.Investments,
                            ]
                        }]
                    }));
                } else {
                    console.error("Error fetching expenses:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchIncomeData();
    }, [userId]);

    useEffect(() => {
        const handleResize = () => {
            setChartWidth(window.innerWidth < 600 ? 280 : 450);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Options for the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Yearly Income',
            },
        },
    };

    return (
        <div style={{ width: `${chartWidth}px`, height: 'auto' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default IncomeDoughnutChart;
