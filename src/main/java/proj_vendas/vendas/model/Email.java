package proj_vendas.vendas.model;

import javax.persistence.Column;

import lombok.Data;

@Data
public class Email {
	
	@Column(nullable = false)
	private String assunto;
	
	@Column(nullable = false)
	private String texto;
	
	@Column(nullable = false)
	private String email;
}

