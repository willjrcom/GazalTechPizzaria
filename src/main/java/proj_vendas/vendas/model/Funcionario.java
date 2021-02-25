package proj_vendas.vendas.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "FUNCIONARIO")
public class Funcionario extends AbstractEntity<Long>{
	
	@Column(nullable=false)
	private int codEmpresa;
	
	@Column(nullable=false)
	private String nome;

	@Column(nullable=false)
	private String cpf;

	private String email;
	
	@Column(nullable=false)
	
	private String celular;
	
	@Column(nullable=false)
	private String cargo;
	
	@Column(nullable=false)
	private String sexo;
	
	private boolean situacao;
	
	@Lob
	private String obs;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date nascimento;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date admissao;

	private int diaPagamento = 10;
	
	private BigDecimal salario;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Pagamento> pagamento; 
}
