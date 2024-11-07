// CMDC.js
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const CMDC = ({ userId }) => {
    const [chartData, setChartData] = useState({
        labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Rent', 'Other'],
        datasets: [{
            label: 'Expenses',
            data: new Array(6).fill(0), // Initialize with zeros for each category
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
               'rgba(0, 51, 102, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(10, 51, 102, 0.2)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 0.5)',
            ],
            borderWidth: 1,
        }],
    });

    const [chartWidth, setChartWidth] = useState(window.innerWidth < 600 ? 280 : 450);

    useEffect(() => {
        const fetchCategoryExpenses = async () => {
            const token = localStorage.getItem('authToken');
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            try {
                const response = await axios.get(`https://budget-buddy-gho3.onrender.com/api/expenses/getAll?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const expenses = response.data.expenses;
                    const categoryExpenses = {
                        Food: 0,
                        Transport: 0,
                        Entertainment: 0,
                        Bills: 0,
                        Rent: 0,
                        Other: 0,
                    };

                    expenses.forEach((expense) => {
                        const expenseDate = new Date(expense.date); // Assuming each expense has a 'date' field
                        if (
                            expense.type === 'Expense' &&
                            expenseDate >= new Date(startOfMonth) &&
                            expenseDate <= new Date(endOfMonth)
                        ) {
                            const category = expense.category;
                            if (categoryExpenses.hasOwnProperty(category)) {
                                categoryExpenses[category] += expense.amount;
                            }
                        }
                    });

                    setChartData((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: [
                                categoryExpenses.Food,
                                categoryExpenses.Transport,
                                categoryExpenses.Entertainment,
                                categoryExpenses.Bills,
                                categoryExpenses.Rent,
                                categoryExpenses.Other,
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

        fetchCategoryExpenses();
    }, [userId]);

    useEffect(() => {
        const handleResize = () => {
            setChartWidth(window.innerWidth < 600 ? 280 : 500);
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
                text: 'Current Month Expenses',
            },
        },
    };

    return (
        <div style={{ width: `${chartWidth}px`, height: 'auto' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default CMDC;
