package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DIVULGACOES")
public class Divulgar extends AbstractEntity<Long> {

	private boolean mostrarNovidades;
	
	private String texto1;
	private String link1;
	private String empresa1;
	private String datai1;
	private String dataf1;
	private float valor1;

	private String texto2;
	private String link2;
	private String empresa2;
	private String datai2;
	private String dataf2;
	private float valor2;

	private String texto3;
	private String link3;
	private String empresa3;
	private String datai3;
	private String dataf3;
	private float valor3;

	private String texto4;
	private String link4;
	private String empresa4;
	private String datai4;
	private String dataf4;
	private float valor4;

	private String texto5;
	private String link5;
	private String empresa5;
	private String datai5;
	private String dataf5;
	private float valor5;
}


