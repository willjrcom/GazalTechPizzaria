package proj_vendas.vendas.web.controller;

public class JasperReport {
/*
	private static final String url = "jdbc:mysql://localhosts/";
	private static final String driver = "com.mysql.jdbc.Driver";
	private static final String login = "";
	private static final String pwd = "";
*/
	public JasperReport() {

	}
	/*
	@SuppressWarnings("deprecation")
	public void gerar(String layout) throws JRException, SQLException, ClassNotFoundException {
		//gerando o jasper design
		JasperDesign desenho = JRXmlLoader.load(layout);

		//compila o relatório
		net.sf.jasperreports.engine.JasperReport relatorio = JasperCompileManager.compileReport(desenho);

		//estabelece conexão
		Class.forName(driver);
		Connection con = DriverManager.getConnection(url, login, pwd);
		Statement stm = (Statement) con.createStatement();
		String query = "select * from turma";
		ResultSet rs = ((java.sql.Statement) stm).executeQuery(query);

		//implementação da interface JRDataSource para DataSource ResultSet
		JRResultSetDataSource jrRS = new JRResultSetDataSource(rs);

		//executa o relatório
		Map<String, Object> parametros = new HashMap<String, Object>();
		parametros.put("nota", new Double(10));
		JasperPrint impressao = JasperFillManager.fillReport(relatorio, parametros, jrRS);

		//exibe o resultado
		JasperViewer viewer = new JasperViewer(impressao, true);
		viewer.show();
	}

	public static void main(String[] args) {
		try {
			new JasperReport().gerar("report.jrxml");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	*/
}