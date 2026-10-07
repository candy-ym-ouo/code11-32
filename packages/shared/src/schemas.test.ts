import { describe, expect, it } from 'vitest';
import { deleteFamilySchema } from './schemas';

describe('deleteFamilySchema', () => {
  it('接受完整确认（名称 + 显式 confirm）', () => {
    const parsed = deleteFamilySchema.safeParse({ confirmName: '我的家', confirm: true });
    expect(parsed.success).toBe(true);
  });

  it('名称会被 trim，纯空白名称视为缺失', () => {
    expect(deleteFamilySchema.safeParse({ confirmName: '   ', confirm: true }).success).toBe(false);
  });

  it('缺少 confirmName 时拒绝（前端不带 body 的老请求应被拦下）', () => {
    expect(deleteFamilySchema.safeParse({ confirm: true }).success).toBe(false);
  });

  it('缺少显式 confirm 时拒绝，防止仅凭名称单信号误删', () => {
    expect(deleteFamilySchema.safeParse({ confirmName: '我的家' }).success).toBe(false);
  });

  it('confirm 非 true（false / 字符串）时拒绝', () => {
    expect(deleteFamilySchema.safeParse({ confirmName: '我的家', confirm: false }).success).toBe(false);
    expect(deleteFamilySchema.safeParse({ confirmName: '我的家', confirm: 'true' }).success).toBe(false);
  });

  it('拒绝多余字段，避免把杂项参数混进破坏性请求', () => {
    expect(
      deleteFamilySchema.safeParse({ confirmName: '我的家', confirm: true, force: 1 }).success,
    ).toBe(false);
  });

  it('空对象拒绝', () => {
    expect(deleteFamilySchema.safeParse({}).success).toBe(false);
  });
});
