defmodule InvetHubWeb.ReportsController do
 use InvetHubWeb, :controller

 alias InvetHub.Inventory.Inventory, as: Inventory
 alias InvetHub.Inventory.InventoryHistory, as: History

 plug(
  InvetHubWeb.Plugs.RequireAuth
  when action in [
    :start,
    :index

  ]
)

 ########################################### SEARCH BRANCH BEFORE ADDING INVENTORY TO THE SYSTEM #######################
 def start(conn, _params) do
   branch = InvetHub.Catalog.Branch.all()
   render(conn, "start.html", branch: branch)
 end

 def index(conn, %{"branch" => query_branch}) do
   inventory = Inventory.where(branch: query_branch)
   branch = InvetHub.Catalog.Branch.find_by(branch: query_branch)
   total_stock = total_stock(query_branch)
   total_out_of_stock = total_out_of_stock(query_branch)
   total_income = total_income(query_branch)
   total_income_out_of_stock = total_income_out_of_stock(query_branch)
   last_date = last_modified(query_branch)
   last_stock_date = last_modified_stock(query_branch)
   difference_stock = difference_stock(query_branch)
   difference = difference(query_branch)
   returns = returns(query_branch)
   balance_stock = balance_stock(query_branch)
   stock_after_stock = stock_after_stock(query_branch)
   expense = expense(query_branch)

   cond do
     branch != nil ->
       {:ok, }
       conn
       |> put_flash(:infor, "successful")
       |> render("index.html",
            inventory: inventory,
            branch: branch,
            total_stock: total_stock,
            total_out_of_stock: total_out_of_stock,
            total_income: total_income,
            total_income_out_of_stock: total_income_out_of_stock,
            last_date: last_date,
            last_stock_date: last_stock_date,
            expense: expense,
            stock_after_stock: stock_after_stock,
            balance_stock: balance_stock,
            returns: returns,
            difference: difference,
            difference_stock: difference_stock
          )
     true ->
       conn
       |> put_flash(:error, "Select branch")
       |> redirect(to: Routes.inventory_path(conn, :start))
   end

 end

 # FUNCTIONS OF ON THE INVENTORY TABLE
 defp last_modified(branch) do
   #last modified for the current stock
   #    date = Inventory.where(branch: branch)
   last_modified = Inventory.last(1, conditions: [branch: branch])
   #    last_modified = Inventory.last(date)
   if last_modified == nil do
     "No Records"
   else
     last_modified.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
   end
 end
 #last modified for item out of stock
 defp last_modified_stock(branch) do
   #    date = History.where(branch: branch)
   last_modified = History.last(1, conditions: [branch: branch])
   #    last_modified = History.last(date)
   if last_modified == nil do
     "No Records"
   else
     last_modified.inserted_at
#     |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S")
   end
 end

 #get the overall income from the out of stock table per branch
 defp total_income_out_of_stock(branch) do
   total_income_out_of_stock = History.aggregate(:total, :sum, [branch: branch])
   if total_income_out_of_stock == nil do
     "No records"
   else
     round(total_income_out_of_stock)
     |> to_string()
     |> (&<>/2).(" ZMK")
   end
 end

 #get the total goods for stock in per branch
 defp total_stock(branch) do
   total_stock = Inventory.aggregate(:quantity, :sum, [branch: branch])
   if total_stock == nil do
     "No Records"
   else
     round(total_stock)
   end
 end

 #get the sum of all the goods out of stock per branch
 defp total_out_of_stock(branch) do
   total_out_of_stock = History.aggregate(:quantity, :sum, [branch: branch])
   if total_out_of_stock == nil do
     "No Records"
   else
#     total_out_of_stock |>:io_lib.format("~.1f")
#     :io_lib.format("~.1f", total_out_of_stock)
     round(total_out_of_stock)
#     |> to_string
   end
 end

 #get the overall income from the current stock per branch
 defp total_income(branch) do
   total_income = Inventory.aggregate(:total, :sum, [branch: branch])
   if total_income == nil do
     "No Records"
   else
#    :io_lib.format("~.1f", total_income)
     round(total_income)
     |> to_string()
     |> (&<>/2).(" ZMK")
#     |> to_string
#     |>:io_lib.format("~.1f")
   end
 end

 #get stock after stock checkout from the inventory table
 defp difference(branch) do
   difference = Inventory.aggregate(:difference, :sum, [branch: branch])
   if difference == nil do
     "No Records"
   else
     round(difference)
#     |> to_string
#     :io_lib.format("~.1f", difference)
   end
 end

 #get balance of good after check out from the inventory table
 defp returns(branch) do
   returns = Inventory.aggregate(:returns, :sum, [branch: branch])
   if returns == nil do
     "No Records"
   else
     round(returns)
#     |> to_string
#     :io_lib.format("~.1f", balance)
   end
 end

 #get the difference of goods from the inventory table
 defp expense(branch) do
   expense = Inventory.aggregate(:expense, :sum, [branch: branch])
   if expense == nil do
     "No Records"
   else
     round(expense)
     |> to_string()
     |> (&<>/2).(" ZMK")
   end
 end

 #get stock after stock checkout from the History table
 defp difference_stock(branch) do
   difference_stock = History.aggregate(:difference, :sum, [branch: branch])
   if difference_stock == nil do
     "No Records"
   else
     round(difference_stock)
#     |> to_string
#     :io_lib.format("~.1f", difference_stock)
   end
 end

 #get balance of good after check out from the History table
 defp balance_stock(branch) do
   balance_stock = History.aggregate(:balance, :sum, [branch: branch])
   if balance_stock == nil do
     "No Records"
   else
     round(balance_stock)
#     |> to_string
#     :io_lib.format("~.1f", balance_stock)
   end
 end

 #get the difference of goods from the History table
 defp stock_after_stock(branch) do
   stock_after_stock = History.aggregate(:quantity, :sum, [branch: branch])
   if stock_after_stock == nil do
     "No Records"
   else
     round(stock_after_stock)
#     |> to_string
#     :io_lib.format("~.1f", stock_after_stock)
   end
 end
end