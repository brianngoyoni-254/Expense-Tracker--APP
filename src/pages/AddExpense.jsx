import { useState, useMemo } from "react";

export default function AddExpense({
  expenses,
  fetchExpenses,
  showToast,
}) {
  const API_URL = "http://localhost:3001/expenses";

  const initialForm = {
    title: "",
    description: "",
    category: "",
    amount: "",
    date: "",
  };

  const [formData, setFormData] =
    useState(initialForm);

  const [customCategory, setCustomCategory] =
    useState("");

  // ERRORS 
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    date: "",
    customCategory: "",
  });

  // UNIQUE CATEGORIES 
  const categories = useMemo(() => {
    return [
      ...new Set(
        expenses
          .map((e) => e.category)
          .filter(Boolean)
      ),
    ];
  }, [expenses]);

  // VALIDATION 
  const validateField = (name, value) => {
    let error = "";

    if (!value || value.toString().trim() === "") {
      error = "This field is required";
    }

    if (name === "amount") {
      if (!value) {
        error = "Amount is required";
      } else if (Number(value) <= 0) {
        error =
          "Amount must be greater than 0";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  // VALIDATE ALL 
  const validateForm = () => {
    const titleValid = validateField(
      "title",
      formData.title
    );

    const descriptionValid = validateField(
      "description",
      formData.description
    );

    const amountValid = validateField(
      "amount",
      formData.amount
    );

    const dateValid = validateField(
      "date",
      formData.date
    );

    const categoryValue =
      formData.category === "__new"
        ? customCategory
        : formData.category;

    const categoryValid = validateField(
      "category",
      categoryValue
    );

    if (formData.category === "__new") {
      const customValid = validateField(
        "customCategory",
        customCategory
      );

      return (
        titleValid &&
        descriptionValid &&
        amountValid &&
        dateValid &&
        categoryValid &&
        customValid
      );
    }

    return (
      titleValid &&
      descriptionValid &&
      amountValid &&
      dateValid &&
      categoryValid
    );
  };

  // INPUT 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // BLUR 
  const handleBlur = (e) => {
    validateField(
      e.target.name,
      e.target.value
    );
  };

  // DELETE CATEGORY 
  const handleDeleteCategory = async (cat) => {
    const confirmDelete = window.confirm(
      `Delete ALL expenses under "${cat}" category?`
    );

    if (!confirmDelete) return;

    try {
      const toDelete = expenses.filter(
        (e) => e.category === cat
      );

      await Promise.all(
        toDelete.map((e) =>
          fetch(`${API_URL}/${e.id}`, {
            method: "DELETE",
          })
        )
      );

      showToast.warning(
        `Category "${cat}" removed`
      );

      fetchExpenses();
    } catch (err) {
      showToast.error(
        "Failed to remove category"
      );
    }
  };

  // SUBMIT 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      showToast.error(
        "Please fill all required fields"
      );
      return;
    }

    let finalCategory = formData.category;

    // NEW CATEGORY 
    if (formData.category === "__new") {
      const exists = categories.some(
        (c) =>
          c.toLowerCase() ===
          customCategory.toLowerCase()
      );

      if (exists) {
        showToast.error(
          "Category already exists"
        );
        return;
      }

      finalCategory = customCategory;
    }

    const payload = {
      ...formData,
      category: finalCategory,
      amount: Number(formData.amount),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error();
      }

      // SUCCESS 
      showToast.success(
        "Saved successfully"
      );

      // RESET FORM 
      setFormData(initialForm);
      setCustomCategory("");

      setErrors({
        title: "",
        description: "",
        category: "",
        amount: "",
        date: "",
        customCategory: "",
      });

      // prevent UI jump feeling 
      fetchExpenses();

    } catch (err) {
      showToast.error(
        "Failed to save expense"
      );
    }
  };

  // UI 
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Add Expense
      </h2>

      {/* CATEGORY MANAGER */}
      <div className="bg-white p-3 mb-4 rounded shadow">
        <h3 className="font-bold mb-2">
          Categories
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div
              key={c}
              className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2"
            >
              {c}

              <button
                type="button"
                onClick={() =>
                  handleDeleteCategory(c)
                }
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-3"
      >
        {/* TITLE */}
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Title"
            className={`border p-2 rounded w-full ${
              errors.title
                ? "border-red-500"
                : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            onBlur={(e) =>
              validateField(
                "category",
                e.target.value
              )
            }
            className={`border p-2 rounded w-full ${
              errors.category
                ? "border-red-500"
                : ""
            }`}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}

            <option value="__new">
              + Add New Category
            </option>
          </select>

          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category}
            </p>
          )}
        </div>

        {/* NEW CATEGORY */}
        {formData.category === "__new" && (
          <div>
            <input
              type="text"
              value={customCategory}
              onChange={(e) =>
                setCustomCategory(e.target.value)
              }
              onBlur={() =>
                validateField(
                  "customCategory",
                  customCategory
                )
              }
              placeholder="Enter new category"
              className={`border p-2 rounded w-full ${
                errors.customCategory
                  ? "border-red-500"
                  : ""
              }`}
            />

            {errors.customCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.customCategory}
              </p>
            )}
          </div>
        )}

        {/* AMOUNT */}
        <div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Amount"
            className={`border p-2 rounded w-full ${
              errors.amount
                ? "border-red-500"
                : ""
            }`}
          />

          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        {/* DATE */}
        <div>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 rounded w-full ${
              errors.date
                ? "border-red-500"
                : ""
            }`}
          />

          {errors.date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.date}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Description"
            className={`border p-2 rounded w-full ${
              errors.description
                ? "border-red-500"
                : ""
            }`}
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition text-white p-2 rounded"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
}