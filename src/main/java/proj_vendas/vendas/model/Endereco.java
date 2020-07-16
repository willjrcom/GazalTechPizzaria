package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "ENDERECOS")
public class Endereco {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String cep;
	private String rua;
	private String n;
	private String bairro;
	private String Cidade;
	private String referencia;
	private String taxa;
	/*
	@OneToOne
	@JoinColumn(name = "cliente_fk")
	private Cliente cliente;
	*/
	@Override
	public String toString() {
		return "Endereco [id=" + id + ", cep=" + cep + ", rua=" + rua + ", n=" + n + ", bairro=" + bairro + ", Cidade="
				+ Cidade + ", referencia=" + referencia + ", taxa=" + taxa + "]";
	}
}
