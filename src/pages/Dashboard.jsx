import { useMemo } from "react";
import SmartSearch from "../components/SmartSearch";

export default function Dashboard({
  expenses,
  search,
  setSearch,
  sortType,
  setSortType,
}) {
  // SAFE DATE 
  const getDate = (d) => new Date(d);

  const formatDate = (date) => {
    const d = getDate(date);

    if (isNaN(d)) return "Invalid date";

    return d.toLocaleDateString("en-GB");
  };

  const getAmount = (e) => Number(e.amount || 0);

  // SEARCH 
  const searchedExpenses = useMemo(() => {
    if (!search.trim()) return expenses;

    return expenses.filter((e) =>
      (e.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [expenses, search]);

  //  SORT 
  const processedExpenses = useMemo(() => {
    let data = [...searchedExpenses];

    if (sortType === "amount") {
      data.sort(
        (a, b) => getAmount(b) - getAmount(a)
      );
    }

    if (sortType === "date") {
      data.sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
    }

    if (sortType === "category") {
      data.sort((a, b) =>
        (a.category || "").localeCompare(
          b.category || ""
        )
      );
    }

    return data;
  }, [searchedExpenses, sortType]);

  // TOTAL 
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + getAmount(e),
    0
  );

  // DATE HELPERS 
  const today = new Date();

  const isSameDay = (date) => {
    const d = getDate(date);

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const d = getDate(date);

    const weekAgo = new Date();

    weekAgo.setDate(today.getDate() - 7);

    return d >= weekAgo && d <= today;
  };

  const isThisMonth = (date) => {
    const d = getDate(date);

    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isThisYear = (date) => {
    const d = getDate(date);

    return (
      d.getFullYear() === today.getFullYear()
    );
  };

  // GROUPS 
  const dailyExpenses = expenses.filter((e) =>
    isSameDay(e.date)
  );

  const weeklyExpenses = expenses.filter((e) =>
    isThisWeek(e.date)
  );

  const monthlyExpenses = expenses.filter((e) =>
    isThisMonth(e.date)
  );

  const yearlyExpenses = expenses.filter((e) =>
    isThisYear(e.date)
  );

  const sum = (arr) =>
    arr.reduce(
      (t, e) => t + getAmount(e),
      0
    );

  const renderItem = (e) => (
    <div
      key={e.id}
      className="border p-3 rounded-xl bg-white"
    >
      <p className="font-bold text-sm">
        {formatDate(e.date)} • {e.category}
      </p>

      <p className="text-xs text-gray-600">
        {e.description}
      </p>

      <p className="text-green-600 font-bold text-sm">
        KES {getAmount(e)}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* TOP NAVBAR */}
      <div className="sticky top-0 z-40 bg-gray-100 pb-2">
        <div className="bg-white p-4 rounded-2xl shadow">
          <SmartSearch
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
            expenses={expenses}
          />
        </div>
      </div>

      {/* RESULTS */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-3">
          Results ({processedExpenses.length})
        </h3>

        <div className="h-[240px] overflow-y-auto space-y-2 pr-2">
          {processedExpenses.map(renderItem)}
        </div>
      </div>

      {/* PERIODS */}
      <div className="grid md:grid-cols-4 gap-4">

        {/* DAILY */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Daily</h3>

          <p className="text-green-600 font-bold">
            KES {sum(dailyExpenses)}
          </p>

          <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
            {dailyExpenses.map(renderItem)}
          </div>
        </div>

        {/* WEEKLY */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Weekly</h3>

          <p className="text-green-600 font-bold">
            KES {sum(weeklyExpenses)}
          </p>

          <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
            {weeklyExpenses.map(renderItem)}
          </div>
        </div>

        {/* MONTHLY */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Monthly</h3>

          <p className="text-green-600 font-bold">
            KES {sum(monthlyExpenses)}
          </p>

          <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
            {monthlyExpenses.map(renderItem)}
          </div>
        </div>

        {/* YEARLY */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Yearly</h3>

          <p className="text-green-600 font-bold">
            KES {sum(yearlyExpenses)}
          </p>

          <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
            {yearlyExpenses.map(renderItem)}
          </div>
        </div>
      </div>

      {/* TOTAL */}
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h2 className="text-xl font-bold">
          Total Expenses
        </h2>

        <p className="text-green-600 text-2xl font-bold">
          KES {totalExpenses}
        </p>
      </div>
    </div>
  );
}