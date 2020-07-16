package proj_vendas.vendas.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
@Entity
@Table(name = "FUNCIONARIOS")
public class Funcionario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nome;

	@Column(unique = true)
	private String cpf;

	private String email;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date nascimento;
 
	//@OneToMany
	private String celular;

	@Enumerated(EnumType.STRING)
	private TipoCargo cargo;

	@Enumerated(EnumType.STRING)
	private TipoSexo sexo;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date admissao;

	private int diaPagamento;
	
	//@Column( columnDefinition = "DECIMAL(7, 2) DEFAULT 0.00")
	private BigDecimal salario;
}
