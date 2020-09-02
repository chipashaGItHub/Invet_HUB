defmodule InvetHub.Inventory.Inventory do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  schema "tbl_inventory" do
    field :quantity, :string
    field :price, :string
    field :size, :string
    field :total, :string
    field :stock_in, :boolean, default: true
    field :branch, :string
    field :status, :boolean, default: true
    field :difference, :string
    field :balance, :string
    field :stock_after, :string
    field :expense, :string
    field :returns, :string, default: "0"
    field :first_stock, :string
    field :moved_stock, :string


    timestamps(type: :utc_datetime)

  end

  @doc false
  def changeset(inventory, attrs) do
    inventory
    |> cast(attrs, [
      :id,
      :quantity,
      :price,
      :size,
      :total,
      :stock_in,
      :branch,
      :status,
      :difference,
      :balance,
      :stock_after,
      :expense,
      :returns,
      :first_stock,
      :moved_stock
    ])
    |> validate_required([
      :quantity,
      :price,
      :size
    ])
  end

end