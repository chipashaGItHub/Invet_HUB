defmodule InvetHubWeb.InventoryController do
  use InvetHubWeb, :controller

  alias InvetHub.Repo
  alias InvetHub.Inventory.Inventory, as: Inventory
  alias InvetHub.Inventory.InventoryHistory, as: History
  alias InvetHub.Logs.System_logs, as: System_logs

  
 plug(
  InvetHubWeb.Plugs.RequireAuth
  when action in [
    :index,
    :add,
    :delete,
    :update,
    :clear_stock,
    :history,
    :move_to_branch,
    :update

  ]
)

## VIEW INVENTORY TABLE
  def index(conn, _params) do
    render(conn, "index.html")
  end
# CRUDE FUNCTIONALITY FOR INVENTORY TABLE
  def add(conn, param) do
    params = %{
      first_stock: param["quantity"],
      quantity: param["quantity"],
      branch: param["branch"],
      total: param["total"],
      size: param["size"],
      price: param["price"]
    }
    Ecto.Multi.new()
    |> Ecto.Multi.insert(:inventory, Inventory.changeset(%Inventory{}, params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{inventory: inventory}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" added a new inventory item with Product size: \"#{inventory.size}\" and product price:  \"ZMK #{inventory.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{inventory: _inventory, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Inventory added successfully"
              )
           |> redirect(to: Routes.inventory_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.inventory_path(conn, :index))
       end
#  rescue
#    _ ->
#      conn
#      |> put_flash(:error, "An error occurred, reason unknown. try again")
#      |> redirect(to: Routes.inventory_path(conn, :index))
  end
  @doc """
        transverse errors
  """

  def traverse_errors(errors) do
    for {key, {msg, _opts}} <- errors, do: "#{key} #{msg}"
  end

   ##  UPDATE THE CURRENT INVENTORY AND SETTING NEW FILEDS IN THE TABLE
  def update(conn, %{"id" => id, "quantity" => quantity} = params) do
    inventory = Inventory.find(id)
    IO.inspect "------------------ hello world "
    IO.inspect params
    new_params = %{
        quantity: quantity,
        price: params["price"],
        stock_after: params["quantity"],
        total: String.to_integer(params["quantity"]) * String.to_integer(params["price"]) |> to_string,
        balance: quantity,
        difference: String.to_integer(inventory.quantity) - String.to_integer(quantity) - String.to_integer(params["returns"]) |> to_string,
        expense: (String.to_integer(inventory.quantity) - String.to_integer(quantity)) * (String.to_integer(inventory.price)) |> to_string,
        returns: params["returns"]
    }

    Ecto.Multi.new()
    |> Ecto.Multi.update(:inventory, Inventory.changeset(inventory, new_params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{inventory: inventory}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" updated inventory items with Product size: \"#{inventory.size}\", product price:  \"ZMK #{inventory.price}\" and sold: \"#{new_params.difference}\" stock"

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{inventory: _inventory, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Inventory updated successfully"
              )
           |> redirect(to: Routes.inventory_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.inventory_path(conn, :index))
       end
#  rescue
#    _ ->
#      conn
#      |> put_flash(:error, "An error occurred, reason unknown. try again")
#      |> redirect(to: Routes.inventory_path(conn, :index))
  end
##### DELETES THE DATA FROM THE TABLE BASED ON AN ID
  def delete(conn, %{"id" => id}) do
    user = Inventory.find(id)

    Ecto.Multi.new()
    |> Ecto.Multi.delete(:delete_all, user)
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{delete_all: delete_all}) ->
      activity = "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Deleted inventory with branch name: \"#{delete_all.branch}\" and size \"#{delete_all.size}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{delete_all: _delete_all, system_logs: _system_logs}} ->
           conn
           |> put_flash(:info, "Deleted inventory successfully.")
           |> redirect(to: Routes.inventory_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()

           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.inventory_path(conn, :index))
       end
  end

  ##### CHANGES THE STATUS OF THE DATA TO BE MOVED IN THE HISTORY TABLE
  def clear_stock(conn, %{"id" => id}) do
    inventory = Inventory.find(id)
    # maps the data in the new object to be moved to history table
    params = %{
    id: inventory.id,
    inserted_at: inventory.inserted_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S"),
    updated_at: inventory.updated_at |> Calendar.DateTime.shift_zone!("Africa/Cairo") |> Calendar.Strftime.strftime!("%d-%b-%Y %H:%M:%S"),
    quantity: inventory.quantity,
    branch: inventory.branch,
    total: inventory.total,
    size: inventory.size,
    balance: inventory.balance,
    price: inventory.price,
    stock_after: inventory.stock_after,
    difference: inventory.difference,
    returns: inventory.returns,
    moved_stock: inventory.moved_stock,
    first_stock: inventory.first_stock
    }

    Ecto.Multi.new()
    |> Ecto.Multi.update(:inventory, Inventory.changeset(inventory, %{status: false, stock_in: false}))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{inventory: inventory}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Stock has been cleared waiting to be emptied with stock size: \"#{inventory.size}\" and stock price:  \"ZMK #{inventory.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{inventory: _inventory, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Stock has been cleared from inventory waiting to de deleted successfully"
              )
           |> redirect(to: Routes.inventory_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.inventory_path(conn, :index))
       end
       # moves data in the database for history to keep records
        History.create(params)
        #deletes data in the inventory table
        Inventory.delete_where(status: false)
  end

  # view table history
  def history(conn, _param) do
    inventory = History.all()
    render(conn, "history.html", inventory: inventory)

  end

  # CRUDE FUNCTIONALITY FOR INVENTORY TABLE
  def move_to_branch(conn, %{"id" => id} = param) do
    inventory = Inventory.find(id)
    params = %{
      first_stock: String.to_integer(inventory.quantity) - String.to_integer(param["quantity"]) |> to_string,
      quantity: String.to_integer(inventory.quantity) - String.to_integer(param["quantity"]) |> to_string,
      branch: param["branch"],
      total: String.to_integer(param["quantity"]) * String.to_integer(param["price"]) |> to_string,
      size: param["size"],
      price: param["price"],
      moved_stock: String.to_integer(inventory.quantity) - String.to_integer(param["quantity"]) |> to_string
    }

    new_params = %{
      quantity: String.to_integer(inventory.quantity) - String.to_integer(param["quantity"]) |> to_string,
      total: String.to_integer(inventory.total) - (String.to_integer(param["quantity"]) * String.to_integer(param["price"])) |> to_string,
      moved_stock: String.to_integer(inventory.quantity) - String.to_integer(param["quantity"]) |> to_string
    }

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:inventory, Inventory.changeset(%Inventory{}, params))
    |> Ecto.Multi.update(:inventory_update, Inventory.changeset(inventory, new_params))
    |> Ecto.Multi.run(:system_logs, fn(inventory_update, %{inventory: inventory}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" moved stock from soweto main branch with Product size: \"#{inventory.size}\" and product price:  \"ZMK #{inventory.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{inventory: _inventory, inventory_update: _inventory_update, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Inventory added successfully"
              )
           |> redirect(to: Routes.inventory_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.inventory_path(conn, :index))
       end
#  rescue
#    _ ->
#      conn
#      |> put_flash(:error, "An error occurred, reason unknown. try again")
#      |> redirect(to: Routes.inventory_path(conn, :index))
  end

end







