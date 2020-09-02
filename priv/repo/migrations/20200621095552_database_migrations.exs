defmodule ZicbProxy.Repo.Migrations.DatabaseMigrations do
  use Ecto.Migration

  # Run on mix ecto.migrate
  def up do
    create_tables()
    create()
  end

  # Run on (mix ecto.rollback --all) or (mix ecto.rollback --to $migration_timestamp)
  def down do
    drop_tables()
  end

  # Function to Create all listed tables
  def create_tables do


    # Create Users Table
    create_if_not_exists table(:tbl_users) do
      add :auto_password, :string, default: "N"
      add :profile, :string
      add :email, :string
      add :first_name, :string
      add :last_name, :string
      add :password, :string
      add :status, :boolean, default: true
      add :user_role, :integer
      add :user_type, :integer
      add :username, :string
      add :phone_number, :string
      add :user_id, :integer


      timestamps(type: :utc_datetime)
    end

    # Create Third Party Accounts Table
    create_if_not_exists table(:tbl_inventory) do
      add :quantity, :string
      add :price, :string
      add :size, :string
      add :total, :string
      add :stock_in, :boolean
      add :branch, :string
      add :status, :boolean
      add :difference, :string
      add :balance, :string
      add :expense, :string
      add :returns, :string
      add :stock_after, :string
      add :first_stock, :string
      add :moved_stock, :string

      timestamps(type: :utc_datetime)
    end
    create_if_not_exists table(:tbl_inventory_history) do
      add :quantity, :string
      add :price, :string
      add :size, :string
      add :total, :string
      add :stock_in, :boolean
      add :branch, :string
      add :status, :boolean
      add :difference, :string
      add :balance, :string
      add :updated_at, :string
      add :inserted_at, :string
      add :expense, :string
      add :returns, :string
      add :stock_after, :string
      add :first_stock, :string
      add :moved_stock, :string

#      timestamps(type: :utc_datetime)
    end
    create_if_not_exists table(:tbl_variation) do
      add :price, :decimal
      add :size, :string
      add :user_id, references(:tbl_users, column: :id, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end
    create_if_not_exists table(:tbl_reports) do
      add :total, :string
      add :quantity, :string
      add :branch, :string
      add :updated_at, :string
      add :inserted_at, :string
      add :difference, :string
      add :balance, :string
      add :stock_after, :string

#      timestamps(type: :utc_datetime)
    end
    create_if_not_exists table(:tbl_branch) do
      add :branch, :string
      add :user_id, references(:tbl_users, column: :id, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end

    # Create Service Request Log
    create_if_not_exists table(:tbl_user_logs) do
      add :activity, :string
      add :user_id, references(:tbl_users, column: :id, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end
    create_if_not_exists table(:tbl_system_logs) do
        add :activity, :string
        add :user_id, references(:tbl_users, column: :id, on_delete: :delete_all)

        timestamps(type: :utc_datetime)
    end

  end

  # Function to Drop all listed tables
  def drop_tables do
    drop_if_exists table(:tbl_users)
    drop_if_exists table(:tbl_user_logs)
    drop_if_exists table(:tbl_system_logs)
    drop_if_exists table(:tbl_inventory)
    drop_if_exists table(:tbl_inventory_history)
    drop_if_exists table(:tbl_variation)
    drop_if_exists table(:tbl_reports)
    drop_if_exists table(:tbl_branch)
  end

  def create do
    execute("INSERT INTO tbl_users (phone_number, last_name,first_name,profile,auto_password, username, password, status, email, inserted_at, updated_at) VALUES ('0976301194', 'Mumbi','Victor','Mwendal Investment','Y','admin',UPPER(SHA2('Brokenv1c', 512)),true,'victormumbi0@gmail.com',current_date,current_date)")
    execute "INSERT INTO tbl_branch (branch, inserted_at, updated_at) VALUES (\"Kabwata\",current_date,current_date)"
    execute "INSERT INTO tbl_branch (branch, inserted_at, updated_at) VALUES (\"Ibex Hill\",current_date,current_date)"
    execute "INSERT INTO tbl_branch (branch, inserted_at, updated_at) VALUES (\"Soweto (Main Branch)\",current_date,current_date)"
    execute "INSERT INTO tbl_branch (branch, inserted_at, updated_at) VALUES (\"Lumumba\",current_date,current_date)"
    end


end
