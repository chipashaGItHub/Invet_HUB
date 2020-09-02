defmodule InvetHub.Inventory.InventoryHistory do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :integer, autogenerate: false}

  schema "tbl_inventory_history" do
    field :quantity, :string
    field :price, :string
    field :size, :string
    field :total, :string
    field :stock_in, :boolean
    field :branch, :string
    field :status, :boolean
    field :updated_at, :string
    field :inserted_at, :string
    field :difference, :string
    field :balance, :string
    field :stock_after, :string
    field :expense, :string
    field :returns, :string
    field :first_stock, :string
    field :moved_stock, :string

    #    belongs_to :user, InstashopAdmin.Schemas.User, foreign_key: :user_id, type: :id


#    timestamps(type: :utc_datetime)

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
      :updated_at,
      :inserted_at,
      :difference,
      :balance,
      :expense,
      :stock_after,
      :returns,
      :first_stock,
      :moved_stock
    ])
  end

end