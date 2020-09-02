defmodule InvetHub.Accounts.User do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  schema "tbl_users" do
    field :auto_password, :string, default: N
    field :profile, :string
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :password, :string
    field :status, :boolean, default: true
    field :user_role, :integer
    field :user_type, :integer
    field :username, :string
    field :phone_number, :string

    belongs_to :user, InvetHub.Accounts.User, foreign_key: :user_id, type: :id
    #    belongs_to :user, InstashopAdmin.Schemas.User, foreign_key: :user_id, type: :id


    timestamps(type: :utc_datetime)

  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :first_name,
      :last_name,
      :phone_number,
      :email,
      :user_role,
      :status,
      :password,
      :user_type,
      :auto_password,
      :username,
      :profile
    ])
    |> validate_required([
      :first_name,
      :last_name,
      :email,
      :user_role,
      :status,
      :user_type
    ])
    |> validate_length(:password,
         min: 4,
         max: 40,
         message: " should be atleast 4 to 40 characters"
       )
    |> validate_length(:username,
         min: 4,
         max: 50,
         message: " should be atleast 4 to 50 characters"
       )
    |> validate_length(:first_name,
         min: 3,
         max: 100,
         message: "should be between 3 to 100 characters"
       )
    |> validate_length(:last_name,
         min: 3,
         max: 100,
         message: "should be between 3 to 100 characters"
       )
    |> validate_length(:email,
         min: 10,
         max: 150,
         message: "should be between 10 to 150 characters"
       )
    |> validate_length(:phone_number,
         min: 3,
         max: 15,
         message: "should be between 3 to 15 characters"
       )
    |> unique_constraint(:email, name: :tbl_users_email_index, message: " address already exists")
    |> unique_constraint(:username, name: :unique_username_tbl_users, message: "Email already exists")
    |> put_pass_hash()
    |> validate_user_role()
  end

  defp validate_user_role(%Ecto.Changeset{valid?: true, changes: %{user_type: type, user_role: role}} = changeset) do
    case role == 3 && type == 2 do
      true ->
        add_error(changeset, :user, " under operations can't be admin")
      _->
        changeset
    end
  end
  defp validate_user_role(changeset), do: changeset

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    Ecto.Changeset.put_change(changeset, :password, encrypt_password(password))
  end
  defp put_pass_hash(changeset), do: changeset

  def encrypt_password(password), do: Base.encode16(:crypto.hash(:sha512, password))
end

# InvetHub.Accounts.User.create([first_name: "Agripa", last_name: "chipasha", email: "chipashachisha@gmail.com", password: "chips@2020", user_type: 1, status: true, user_role: "1", auto_password: "Y", profile_id: "1", username: "Admin", profile: "Probase", phone_number: "+260975984220", inserted_at: NaiveDateTime.utc_now, updated_at: NaiveDateTime.utc_now])
# InvetHub.Accounts.create_user(%{first_name: "Meyer", last_name: "Banda", email: "meyerbanda@gmail.com", password: "password07", user_type: 2, status: 1, user_role: "driver", age: 24, dl_exp_dt: "2020-05-07", dln: "620893521", dlt: "B", home_add: "A217 Navutika Compound", nrc_no: "620893/52/1", phone: "+260976971215", sex: "F", inserted_at: NaiveDateTime.utc_now, updated_at: NaiveDateTime.utc_now})
# InvetHub.Accounts.create_user(%{first_name: "John", last_name: "Mfula", email: "johnmfula360@gmail.com", password: "cool", user_type: 1, status: 1, user_role: "admin", age: 24, dl_exp_dt: "2020-05-07", dln: "342891101", dlt: "B", home_add: "202/20 Roma Null Off Zambezi Road", nrc_no: "342891/10/1", phone: "+260979797337", sex: "M", inserted_at: NaiveDateTime.utc_now, updated_at: NaiveDateTime.utc_now})
# InvetHub.Accounts.create_user(%{first_name: "Eddie", last_name: "Phiri", email: "eddie@probasegroup.com", password: "password07", user_type: 2, status: 1, user_role: "driver", age: 24, dl_exp_dt: "2020-05-07", dln: "34569812", dlt: "B", home_add: "plot23", nrc_no: "34569812/10/1", phone: "+260977097645", sex: "M", inserted_at: NaiveDateTime.utc_now, updated_at: NaiveDateTime.utc_now})