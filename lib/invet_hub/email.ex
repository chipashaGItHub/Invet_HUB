defmodule InvetHub.Email do
    import Bamboo.Email
    alias InvetHub.Mailer
    # alias Bamboo.Attachment
    use Bamboo.Phoenix, view: InvetHubWeb.EmailView
    alias InvetHub.Mailer
  
  
    # def send_email_notification(attr) do
    #   Notifications.list_tbl_email_logs()
    #   |> Task.async_stream(&(email_alert(&1.email, attr) |> Mailer.deliver_now()),
    #     max_concurrency: 10,
    #     timeout: 30_000
    #   )
    #   |> Stream.run()
    # end  Prolegals.Emails.Email.password("coilardium")
  
  #  def password_alert(email, password) do
  #    password(email, password) |> Mailer.deliver_later()
  #  end
  #
  #  def confirm_password_reset(token, email) do
  #    confirmation_token(token, email) |> Mailer.deliver_later()
  #  end
  #
  #  def password(email, password) do
  #    new_email()
  #    |> from("chipashachisha50@gmail.com")
  #    |> to("#{email}")
  ##    |> put_html_layout({MandaloBusSystemWeb.Email.View, "reset.html"})
  #    |> subject("Recovery Password")
  #    |> assign(:password, password)
  ##    |> render("reset.html")
  #  end
  
  #  def confirmation_token(token, email) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("#{email}")
  #    |> put_html_layout({ReportsWeb.LayoutView, "email.html"})
  #    |> subject("Prolegals Password Reset")
  #    |> assign(:token, token)
  #    |> render("token_content.html")
  #  end
  #
    def password(email, password, first_name, last_name) do
      new_email()
      |> from("victormumbi0@gmail.com")
      |> to("#{email}")
      |> subject("Recovery Password")
      |> text_body(
           """
           Dear: #{first_name} #{last_name} 
           
           your recovery password is : #{password} to Invet Hub System. please use this password to recover your account on the system.
  
           """
         )
      |> Mailer.deliver_later()
    end
  #
  #  def send_alert_1(issue, urgency, bus_name, platiform) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("mushilingwaj@gmail.com")
  #    |> subject("Probase Issue Tracker")
  #    |> text_body(
  #         """
  #
  #         An Issue has been logged in by a client.
  #         Name of Cilent : #{bus_name}
  #         Issue:  #{issue}
  #         Platform giving issues :  #{platiform}
  #         Description :  #{urgency}
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  #  def send_alert_2(issue, urgency, bus_name, platiform) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("reaganchita@gmail.com")
  #    |> subject("Probase Issue Tracker")
  #    |> text_body(
  #         """
  #
  #         An Issue has been logged in by a client.
  #          Name of Cilent : #{bus_name}
  #          Issue:  #{issue}
  #          Platform giving issues :  #{platiform}
  #          Description :  #{urgency}
  #
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  #  ###########################################Developer Email######################################
  #  def send_dev(issue, urgency, bus_name, platiform, rep_name) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("#{rep_name}")
  #    |> subject("Probase Issue Tracker")
  #    |> text_body(
  #         """
  #
  #         An Issue has been assigned to you.
  #          Name of Cilent : #{bus_name}
  #          Issue:  #{issue}
  #          Platform giving issues :  #{platiform}
  #          Description :  #{urgency}
  #
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  #  #################################################################################
  #
  #
  #  def appointment(name, comment, appoint_date, time, email) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("#{email}")
  #    |> subject("Appointment")
  #    |> text_body(
  #         """
  #         An appointment has been scheduled by a client.
  #         Name of Cilent : #{name}
  #         Purpose :  #{comment}
  #         Date  of Appointment:  #{appoint_date}
  #         Time of Appointment:  #{time}
  #
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  #  def send_feedback(name, comment, appoint_date, time, status, clients_email, reason) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("#{clients_email}")
  #    |> subject("Appointment")
  #    |> text_body(
  #         """
  #         The appointment you scheduled has been:  #{status}
  #
  #         Purpose :  #{comment}
  #         Date  of Appointment:  #{appoint_date}
  #         Time of Appointment:  #{time}
  #         Feedback : #{reason}
  #
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  #send_password_recovery_emali
  #  def acc_creation(email, password) do
  #    new_email()
  #    |> from("mushilingwaj@gmail.com")
  #    |> to("#{email}")
  #    |> subject("Probase Issue Tracker Accounts")
  #    |> text_body(
  #         """
  #         Your Probase Account has been created succesfully:
  #         Use the following Credentials to login your Account
  #
  #         Email :  #{email}
  #         Password : #{password}
  #
  #         """
  #       )
  #    |> Mailer.deliver_later()
  #  end
  
  
  end