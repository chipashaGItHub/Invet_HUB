defmodule InvetHubWeb.DashboardController do
  use InvetHubWeb, :controller

  alias InvetHub.Inventory.Inventory, as: Inventory

 plug(
  InvetHubWeb.Plugs.RequireAuth
  when action in [
    :all,
    :index,
    :kabwata,
    :ibex_hill,
    :soweto,
    :lumumba

  ]
)

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # OVERALL REPORT FOR ALL THE BRANCHES
  def all(conn, _params) do
    inventory = Inventory.all()
    total_stock
    total_income
    difference
    last_modified
    expense
    returns
    conn
    |> render("overall_report.html",
        inventory: inventory,
        total_stock: total_stock,
        total_income: total_income,
        difference: difference,
        returns: returns,
        expense: expense,
        last_modified: last_modified
       )
  end
  # OVERALL PER BRANCH - KABWATA
  def kabwata(conn, _params) do
    inventory = Inventory.where(branch: "Kabwata")
    total_stock = total_stock_kabwata
    total_income = total_income_kabwata
    difference = difference_kabwata
    last_modified = last_modified_kabwata
    expense = expense_kabwata
    returns = returns_kabwata
    conn
    |> render("kabwata.html",
         inventory: inventory,
         total_stock: total_stock,
         total_income: total_income,
         difference: difference,
         returns: returns,
         expense: expense,
         last_modified: last_modified
       )
  end

  # IBEX HILL BRANCH REPORT
  def ibex_hill(conn, _params) do
    inventory = Inventory.where(branch: "Ibex Hill")
    total_stock = total_stock_ibex_hill
    total_income = total_income_ibex_hill
    difference = difference_ibex_hill
    last_modified = last_modified_ibex_hill
    expense = expense_ibex_hill
    returns = returns_ibex_hill
    conn
    |> render("ibex_hill.html",
         inventory: inventory,
         total_stock: total_stock,
         total_income: total_income,
         difference: difference,
         returns: returns,
         expense: expense,
         last_modified: last_modified
       )
  end

  # SOWETO MAIN BRANCH REPORT
  def soweto(conn, _params) do
    inventory = Inventory.where(branch: "Soweto (Main Branch)")
    total_stock = total_stock_soweto
    total_income = total_income_soweto
    difference = difference_soweto
    last_modified = last_modified_soweto
    expense = expense_soweto
    returns = returns_soweto
    conn
    |> render("soweto.html",
         inventory: inventory,
         total_stock: total_stock,
         total_income: total_income,
         difference: difference,
         returns: returns,
         expense: expense,
         last_modified: last_modified
       )
  end

  #LUMUMBA BRANCH REPORT
  def lumumba(conn, _params) do
    inventory = Inventory.where(branch: "Lumumba")
    total_stock = total_stock_lumumba
    total_income = total_income_lumumba
    difference = difference_lumumba
    last_modified = last_modified_lumumba
    expense = expense_lumumba
    returns = returns_lumumba
    conn
    |> render("lumumba.html",
         inventory: inventory,
         total_stock: total_stock,
         total_income: total_income,
         difference: difference,
         returns: returns,
         expense: expense,
         last_modified: last_modified
       )
  end


  #get the difference of goods from the inventory table
  defp total_stock do
    total_stock = Inventory.aggregate(:quantity, :sum)
    if total_stock == nil do
      "No Records"
    else
      round(total_stock)
    end
  end

  defp total_stock_kabwata do
    total_stock_kabwata = Inventory.aggregate(:quantity, :sum, [branch: "Kabwata"])
    if total_stock_kabwata == nil do
      "No Records"
    else
      round(total_stock_kabwata)
    end
  end

  defp total_stock_ibex_hill do
    total_stock_ibex_hill = Inventory.aggregate(:quantity, :sum, [branch: "Ibex Hill"])
    if total_stock_ibex_hill == nil do
      "No Records"
    else
      round(total_stock_ibex_hill)
    end
  end

  defp total_stock_soweto do
    total_stock_soweto = Inventory.aggregate(:total, :sum, [branch: "Soweto (Main Branch)"])
    if total_stock_soweto == nil do
      "No records"
    else
      round(total_stock_soweto)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp total_stock_lumumba do
    total_stock_lumumba = Inventory.aggregate(:total, :sum, [branch: "Lumumba"])
    if total_stock_lumumba == nil do
      "No records"
    else
      round(total_stock_lumumba)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  #GETS THE TOTAL VALUE OF THE GOODS IN STOCK
  defp total_income do
    total_income = Inventory.aggregate(:total, :sum)
    if total_income == nil do
      "No records"
    else
      round(total_income)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp total_income_kabwata do
    total_income_kabwata = Inventory.aggregate(:total, :sum, [branch: "kabwata"])
    if total_income_kabwata == nil do
      "No records"
    else
      round(total_income_kabwata)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp total_income_ibex_hill do
    total_income_ibex_hill = Inventory.aggregate(:total, :sum, [branch: "Ibex Hill"])
    if total_income_ibex_hill == nil do
      "No records"
    else
      round(total_income_ibex_hill)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp total_income_soweto do
    total_income_soweto = Inventory.aggregate(:total, :sum, [branch: "Soweto (Main Branch"])
    if total_income_soweto == nil do
      "No records"
    else
      round(total_income_soweto)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp total_income_lumumba do
    total_income_lumumba = Inventory.aggregate(:total, :sum, [branch: "Lumumba"])
    if total_income_lumumba == nil do
      "No records"
    else
      round(total_income_lumumba)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end



  #GET THE SOLD OUT STOCK AND GIVES THE TOTAL NUMBER OF STOCK SOLD
  defp difference do
    difference = Inventory.aggregate(:difference, :sum)
    if difference == nil do
      "No records"
    else
      round(difference)
    end
  end

  defp difference_kabwata do
    difference = Inventory.aggregate(:difference, :sum, [branch: "kabwata"])
    if difference == nil do
      "No records"
    else
      round(difference)
    end
  end

  defp difference_ibex_hill do
    difference_ibex_hill = Inventory.aggregate(:difference, :sum, [branch: "Ibex Hill"])
    if difference_ibex_hill == nil do
      "No records"
    else
      round(difference_ibex_hill)
    end
  end

  defp difference_soweto do
    difference_soweto = Inventory.aggregate(:difference, :sum, [branch: "Soweto (Main Branch)"])
    if difference_soweto == nil do
      "No records"
    else
      round(difference_soweto)
    end
  end

  defp difference_lumumba do
    difference_lumumba = Inventory.aggregate(:difference, :sum, [branch: "Lumumba"])
    if difference_lumumba == nil do
      "No records"
    else
      round(difference_lumumba)
    end
  end

  #STOCK TO BE RETURNED
  defp returns do
    returns = Inventory.aggregate(:returns, :sum)
    if returns == nil do
      "No records"
    else
      round(returns)
    end
  end

  defp returns_kabwata do
    returns_kabwata = Inventory.aggregate(:returns, :sum, [branch: "kabwata"])
    if returns_kabwata == nil do
      "No records"
    else
      round(returns_kabwata)
    end
  end

  defp returns_ibex_hill do
    returns_ibex_hill = Inventory.aggregate(:returns, :sum, [branch: "Ibex Hill"])
    if returns_ibex_hill == nil do
      "No records"
    else
      round(returns_ibex_hill)
    end
  end

  defp returns_soweto do
    returns_soweto = Inventory.aggregate(:returns, :sum, [branch: "Soweto (Main Branch)"])
    if returns_soweto == nil do
      "No records"
    else
      round(returns_soweto)
    end
  end

  defp returns_lumumba do
    returns_lumumba = Inventory.aggregate(:returns, :sum, [branch: "Lumumba"])
    if returns_lumumba == nil do
      "No records"
    else
      round(returns_lumumba)
    end
  end

  #VALUE OF THE STOCK SOLD
  defp expense do
    expense = Inventory.aggregate(:expense, :sum)
    if expense == nil do
      "No records"
    else
      round(expense)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp expense_kabwata do
    expense_kabwata = Inventory.aggregate(:expense, :sum, [branch: "kabwata"])
    if expense_kabwata == nil do
      "No records"
    else
      round(expense_kabwata)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp expense_ibex_hill do
    expense_ibex_hill = Inventory.aggregate(:expense, :sum, [branch: "Ibex Hill"])
    if expense_ibex_hill == nil do
      "No records"
    else
      round(expense_ibex_hill)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp expense_soweto do
    expense_soweto = Inventory.aggregate(:expense, :sum, [branch: "Soweto (Main Branch)"])
    if expense_soweto == nil do
      "No records"
    else
      round(expense_soweto)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  defp expense_lumumba do
    expense_lumumba = Inventory.aggregate(:expense, :sum, [branch: "Lumumba"])
    if expense_lumumba == nil do
      "No records"
    else
      round(expense_lumumba)
      |> to_string()
      |> (&<>/2).(" ZMK")
    end
  end

  # last modified
  defp last_modified do
    last_modified = Inventory.last(1)
    #    last_modified = Inventory.last(date)
    if last_modified == nil do
      "No Records"
    else
      last_modified.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
    end
  end

  defp last_modified_kabwata do
    last_modified_kabwata = Inventory.last(1, conditions: [branch: "kabwata"])
    #    last_modified = Inventory.last(date)
    if last_modified_kabwata == nil do
      "No Records"
    else
      last_modified_kabwata.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
    end
  end

  defp last_modified_ibex_hill do
    last_modified_ibex_hill = Inventory.last(1, conditions: [branch: "Ibex Hill"])
    #    last_modified = Inventory.last(date)
    if last_modified_ibex_hill == nil do
      "No Records"
    else
      last_modified_ibex_hill.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
    end
  end

  defp last_modified_soweto do
    last_modified_soweto = Inventory.last(1, conditions: [branch: "Soweto (Main Branch)"])
    #    last_modified = Inventory.last(date)
    if last_modified_soweto == nil do
      "No Records"
    else
      last_modified_soweto.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
    end
  end

  defp last_modified_lumumba do
    last_modified_lumumba = Inventory.last(1, conditions: [branch: "Lumumba"])
    #    last_modified = Inventory.last(date)
    if last_modified_lumumba == nil do
      "No Records"
    else
      last_modified_lumumba.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
    end
  end

end