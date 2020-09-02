defmodule InvetHub.Catalog.Variation do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  schema "tbl_variation" do
    field :price, :decimal
    field :size, :string

    belongs_to :user, InvetHub.Accounts.User, foreign_key: :user_id, type: :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(variation, attrs) do
    variation
    |> cast(attrs, [
      :id,
      :user_id,
      :price,
      :size
    ])
    |> validate_required([:price, :size])
  end
end