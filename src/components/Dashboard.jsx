import React from 'react';
import { loadData } from '../services/storage';

export default function Dashboard() {
  const { transactions, goals } = loadData();
  const balance = transactions.reduce((sum, tx) => sum + (tx.type === 'entrada' ? tx.value : -tx.value), 0);
  const income = transactions.filter(tx => tx.type === 'entrada').reduce((sum, tx) => sum + tx.value, 0);
  const expense = transactions.filter(tx => tx.type === 'saida').reduce((sum, tx) => sum + tx.value, 0);

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-sm text-gray-500">Saldo Atual</h2>
          <p className="text-2xl font-semibold text-green-600">R$ {balance}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-sm text-gray-500">Total de Entradas</h2>
          <p className="text-2xl font-semibold text-blue-600">R$ {income}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-sm text-gray-500">Total de Saídas</h2>
          <p className="text-2xl font-semibold text-red-500">R$ {expense}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Metas</h2>

      <div className="space-y-4">
        {goals.map(goal => {
          const progress = Math.min((goal.saved / goal.amount) * 100, 100);
          return (
            <div key={goal.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{goal.name}</span>
                <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">R$ {goal.saved} de R$ {goal.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}