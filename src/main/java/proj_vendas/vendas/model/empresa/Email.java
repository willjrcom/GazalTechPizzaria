package proj_vendas.vendas.model.empresa;

import javax.persistence.Column;

import lombok.Data;

@Data
public class Email {
	@Column
	private String assunto;

	@Column
	private String texto;

	@Column
	private String email;
}

