import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve(".");
const outDir = path.join(root, "deliverables", "sheets");
const previewDir = path.join(outDir, "previews");

const wb = Workbook.create();

function addSheet(name, rows, options = {}) {
  const sheet = wb.worksheets.add(name);
  const cols = rows[0].length;
  const range = sheet.getRange(`A1:${String.fromCharCode(64 + cols)}${rows.length}`);
  range.values = rows;
  range.format = {
    font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#D1D5DB" },
  };
  sheet.getRange(`A1:${String.fromCharCode(64 + cols)}1`).format = {
    fill: "#D9EAF7",
    font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#1F4E79" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: "#A6BDD7" },
  };
  range.format.autofitColumns();
  range.format.autofitRows();
  if (options.statusCol) {
    const col = options.statusCol;
    sheet.getRange(`${col}2:${col}${rows.length}`).conditionalFormats.add("containsText", {
      text: "高",
      format: { fill: "#FECACA", font: { color: "#991B1B", bold: true } },
    });
    sheet.getRange(`${col}2:${col}${rows.length}`).conditionalFormats.add("containsText", {
      text: "通过",
      format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } },
    });
  }
  return sheet;
}

const dashboard = wb.worksheets.add("项目总览");
dashboard.getRange("A1:H1").values = [["企业级大数据处理平台 - 开发交付总览", "", "", "", "", "", "", ""]];
dashboard.getRange("A1:H1").format = {
  fill: "#1F4E79",
  font: { name: "Microsoft YaHei", size: 15, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
dashboard.getRange("A3:H8").values = [
  ["技术栈", "Vue 3 + TypeScript", "后端", "Spring Boot 3 + Java 21", "数据库", "PostgreSQL 16", "部署", "Docker + Nginx"],
  ["项目周期", "12 周", "里程碑", "7 个", "核心模块", "12 个", "核心页面", "14 个"],
  ["首期边界", "数据源/接入/编排/质量/文件/审计/监控", "", "", "", "", "", ""],
  ["验收红线", "P0/P1 缺陷为 0；核心链路可演示；安全审计可追溯", "", "", "", "", "", ""],
  ["关键依赖", "PostgreSQL、Redis、MinIO、Nginx、CI/CD、测试数据集", "", "", "", "", "", ""],
  ["项目经理提示", "每周五进行里程碑评审；接口契约冻结后变更走评审单", "", "", "", "", "", ""],
];
dashboard.getRange("A3:H8").format = {
  font: { name: "Microsoft YaHei", size: 10, color: "#1F2937" },
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D1D5DB" },
};
dashboard.getRange("A3:A8").format.fill = "#EAF3F8";
dashboard.getRange("C3:C4").format.fill = "#EAF3F8";
dashboard.getRange("E3:E4").format.fill = "#EAF3F8";
dashboard.getRange("G3:G4").format.fill = "#EAF3F8";
dashboard.getRange("A1:H8").format.autofitColumns();

const scheduleRows = [
  ["里程碑", "开始周", "结束周", "周期", "主要交付", "前置依赖", "负责人", "验收方式"],
  ["M0 立项准备", 1, 1, "1 周", "需求确认、范围冻结、技术选型、环境准备", "业务方确认", "项目经理/产品经理", "立项评审通过"],
  ["M1 基础平台", 2, 3, "2 周", "登录、权限、菜单、系统配置、基础 CI", "M0", "后端负责人/前端负责人", "基础功能演示"],
  ["M2 数据接入", 4, 5, "2 周", "数据源、接入任务、文件上传、MinIO、接入日志", "M1", "后端工程师 A", "接入链路跑通"],
  ["M3 调度编排", 6, 8, "3 周", "DAG 编排、调度、实例日志、重跑/终止", "M2", "后端工程师 B/前端工程师 B", "任务全链路演示"],
  ["M4 质量与告警", 9, 10, "2 周", "质量规则、检测报告、告警中心、通知订阅", "M3", "后端工程师 C/测试工程师", "异常闭环演示"],
  ["M5 运维与审计", 11, 11, "1 周", "系统监控、审计日志、导出、权限复核", "M4", "DevOps/后端负责人", "运维验收通过"],
  ["M6 联调验收", 12, 12, "1 周", "联调、压测、安全检查、验收报告、上线交付", "M5", "全体", "验收签字"],
];
const schedule = addSheet("开发排期表", scheduleRows);
schedule.charts.add("bar", {
  title: "里程碑周期分布",
  categories: scheduleRows.slice(1).map((r) => r[0]),
  series: [{ name: "周期周数", values: [1, 2, 2, 3, 2, 1, 1] }],
  hasLegend: false,
  from: { row: 10, col: 1 },
  extent: { widthPx: 760, heightPx: 320 },
});

addSheet("任务分工表", [
  ["角色", "人数", "核心职责", "主要模块", "关键产出", "协作对象"],
  ["项目经理", 1, "范围、排期、风险、验收、会议节奏", "全项目", "项目计划、周报、风险台账、验收材料", "业务方/技术负责人"],
  ["产品经理", 1, "需求、原型、验收用例、培训材料", "页面与流程", "PRD、原型说明、验收清单", "前端/测试/业务方"],
  ["前端工程师 A", 1, "框架、权限路由、页面模板、看板", "门户、看板、权限、审计", "前端基础工程与关键页面", "产品/后端"],
  ["前端工程师 B", 1, "数据源、接入、DAG 编排、文件资产", "数据接入、调度、文件", "业务页面与交互组件", "后端/测试"],
  ["后端工程师 A", 1, "认证权限、数据源、接入任务", "权限、数据接入", "接口、表结构、服务实现", "前端/测试"],
  ["后端工程师 B", 1, "任务编排、调度、实例日志", "DAG、调度、日志", "调度核心能力", "DevOps/前端"],
  ["后端工程师 C", 1, "质量规则、告警、文件、审计", "质量、告警、MinIO、审计", "质量闭环与安全留痕", "测试/产品"],
  ["测试工程师", "1-2", "测试计划、用例、自动化、缺陷闭环", "全模块", "测试用例、测试报告、缺陷清单", "全体"],
  ["DevOps", 1, "容器化、CI/CD、环境、监控、备份", "部署运维", "Docker、Nginx、发布与回滚方案", "后端/项目经理"],
]);

addSheet("测试用例表", [
  ["用例编号", "模块", "测试场景", "前置条件", "操作步骤", "预期结果", "优先级", "验收类型"],
  ["TC-001", "认证", "账号密码登录成功", "用户已启用", "输入正确账号密码并提交", "进入总览看板，菜单按权限展示", "高", "功能"],
  ["TC-002", "权限", "无权限访问被拦截", "用户缺少角色权限", "直接访问受限路由/API", "返回 403，前端展示无权限提示", "高", "安全"],
  ["TC-003", "数据源", "创建 PostgreSQL 数据源并测试连接", "测试库可访问", "填写连接参数并点击测试", "连接成功，凭据不明文展示", "高", "功能/安全"],
  ["TC-004", "接入任务", "配置文件接入任务", "已上传 CSV 文件", "选择文件、字段映射、目标表并保存", "任务保存成功，可手动运行", "高", "功能"],
  ["TC-005", "调度", "DAG 工作流手动触发", "已发布工作流", "点击运行并查看实例", "实例状态从运行中变为成功，日志完整", "高", "端到端"],
  ["TC-006", "调度", "失败节点重跑", "存在失败实例", "点击失败节点重跑", "仅重跑指定节点及后续依赖节点", "高", "端到端"],
  ["TC-007", "质量", "质量规则阈值告警", "配置非空率阈值", "运行质量检测", "低于阈值时生成告警和质量报告", "高", "端到端"],
  ["TC-008", "文件", "生成临时下载地址", "存在文件资产", "点击下载", "返回短期有效签名 URL，审计记录生成", "中", "功能/安全"],
  ["TC-009", "告警", "确认并关闭告警", "存在待处理告警", "确认、填写处理说明、关闭", "状态流转正确，操作人留痕", "中", "功能"],
  ["TC-010", "审计", "查询敏感操作日志", "存在导出/授权记录", "按用户和时间筛选", "日志可查，字段完整，可导出", "高", "安全"],
  ["TC-011", "性能", "任务实例列表分页", "存在 10000 条实例", "按状态筛选并翻页", "2 秒内返回，无明显卡顿", "中", "性能"],
  ["TC-012", "可用性", "移动端查看告警列表", "浏览器宽度 375px", "打开告警中心并处理告警", "无横向滚动，按钮可点击，文本可读", "中", "体验"],
], { statusCol: "G" });

addSheet("验收清单", [
  ["验收项", "验收标准", "证明材料", "责任人", "状态"],
  ["核心功能", "数据源、接入、编排、运行、质量、告警、文件、审计可演示", "演示记录/截图/接口记录", "项目经理", "待验收"],
  ["缺陷关闭", "P0/P1 为 0，P2 有关闭计划", "缺陷统计表", "测试工程师", "待验收"],
  ["性能", "列表 2 秒内响应，任务触发 1 秒内返回", "压测报告", "后端负责人", "待验收"],
  ["安全", "越权拦截、凭据加密、敏感操作审计", "安全测试报告", "后端负责人", "待验收"],
  ["部署", "Docker + Nginx 可部署，健康检查可用", "部署手册/环境记录", "DevOps", "待验收"],
  ["文档", "需求、设计、接口、测试、部署、验收文档齐全", "文档清单", "项目经理", "待验收"],
]);

addSheet("风险台账", [
  ["风险编号", "风险描述", "影响", "概率", "等级", "应对措施", "负责人"],
  ["R-001", "数据源类型扩展过多导致延期", "范围膨胀", "中", "高", "首期限定 PostgreSQL/MySQL/文件/Kafka，其余插件化预留", "产品经理"],
  ["R-002", "DAG 编排需求复杂度失控", "开发延期", "中", "高", "首期只做常见依赖、定时、重跑，高级分支进入二期", "后端负责人"],
  ["R-003", "凭据与文件访问存在安全风险", "数据泄露", "低", "高", "凭据加密、最小权限、短期签名 URL、审计留痕", "后端负责人"],
  ["R-004", "任务日志和实例列表性能不足", "体验下降", "中", "中", "日志入 MinIO，列表分页索引，异步查询与压测基线", "后端工程师 B"],
  ["R-005", "验收口径不清", "返工", "中", "高", "按模块定义验收场景、测试数据、通过阈值和证明材料", "项目经理"],
  ["R-006", "跨团队环境交付不稳定", "联调延迟", "中", "中", "Docker Compose 固化环境，CI/CD 自动部署，变更评审", "DevOps"],
], { statusCol: "E" });

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

for (const sheetName of ["项目总览", "开发排期表", "测试用例表", "验收清单", "风险台账"]) {
  const blob = await wb.render({ sheetName, scale: 1.5 });
  const bytes = Buffer.from(await blob.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `${sheetName}.png`), bytes);
}

const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(path.join(outDir, "企业级大数据处理平台_开发排期任务测试验收表.xlsx"));

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson || "no formula errors");
console.log(path.join(outDir, "企业级大数据处理平台_开发排期任务测试验收表.xlsx"));
